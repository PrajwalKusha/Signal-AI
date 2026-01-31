import json
import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_experimental.utilities import PythonREPL
from state import AgentState, Recommendation
import re

def strategist_agent(state: AgentState):
    """
    Strategist Agent (v2): Tool-Augmented Financial Reasoner.
    1. Matches Signals -> Backlog Item (LLM).
    2. Market Research (Tavily): Validates the need and finds competitors.
    3. ROI Calculation (Python): Deterministically calculates Impact, Cost, and Feasibility.
    4. Outputs 'EnrichedRecommendation' list sorted by Net Strategic Value.
    """
    print("--- Strategist Agent: Financial Reasoning (Tool-Augmented) ---")
    
    anomalies = state.get("anomalies", [])
    insights = state.get("context_insights", [])
    backlog_path = state["backlog_data_path"]
    recommendations = []
    
    if not anomalies:
        return {"recommendations": []}

    # Load Backlog
    try:
        with open(backlog_path, "r") as f:
            backlog_data = json.load(f)
            backlog_str = json.dumps(backlog_data[:15], indent=2) 
    except Exception as e:
        print(f"Error reading backlog: {e}")
        return {"recommendations": []}

    api_key = os.getenv("OPENAI_API_KEY")
    tavily_key = os.getenv("TAVILY_API_KEY") # User must provide this
    
    if not api_key: 
        print("Missing OPENAI_API_KEY")
        return {"recommendations": []}
    
    # Initialize Tools
    # Agent 3: Strategist - Complex Reasoning & ROI -> gpt-4o
    llm = ChatOpenAI(temperature=0, model="gpt-4o")
    tavily = TavilySearchResults(k=3) if tavily_key else None
    python_repl = PythonREPL()

    for signal in anomalies:
        # 1. Match Signal to Backlog (Selection Phase)
        related_insight = next((i for i in insights if i["signal_id"] == signal["id"]), None)
        context_str = f"Context: {related_insight['content']}" if related_insight else ""
        
        system_prompt = """You are a Senior Strategic Transformation Architect.
Your goal is to align operational problems with the most high-leverage digital transformation initiatives from the backlog.
You generally favor 'Platform' solutions over point solutions if the problem is systemic.
Verify that the solution directly addresses the root cause described in the context."""

        human_prompt = f"""
        Signal: {signal['description']} ({signal['value']} impact).
        {context_str}
        
        Backlog: {backlog_str}
        
        Select the best project to solve this. Return JSON with 'project_id' and 'complexity_points'.
        """
        match_res = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]).content
        try:
            match_json = json.loads(re.search(r'\{.*\}', match_res, re.DOTALL).group())
            project_id = match_json.get("project_id")
            complexity = match_json.get("complexity_points", 5)
            selected_project = next((p for p in backlog_data if p["id"] == project_id), None)
            if not selected_project: continue
        except:
            continue

        # 2. Market Research (Validation Phase)
        market_context = "No market data (missing API key)."
        if tavily:
            try:
                query = f"industry trends solution for {signal['description']} and {selected_project['title']}"
                search_results = tavily.invoke(query)
                market_context = "\n".join([r['content'][:200] for r in search_results])
            except Exception as e:
                print(f"Tavily error: {e}")

        # 3. Deterministic ROI Logic (Math Phase)
        # We construct a Python script to solve the ROI equation.
        # TAP (Total Addressable Problem) = Estimate from signal value (parsing string to number)
        
        # Heuristic parsing of signal value
        val_str = signal['value'].replace("%", "").replace("$", "").replace(",", "")
        try:
            val_float = float(val_str)
        except:
            val_float = 0
            
        # If percentage (e.g. 34.2), assume base revenue of $10M for the segment to get TAP
        tap_base = 10_000_000 
        tap_value = (val_float / 100) * tap_base if "%" in signal['value'] else 1_000_000 # default fallback
        
        python_script = f"""
def calculate_roi(tap, complexity, feasibility_factor=0.8):
    # Cost Basis: $20k per complexity point
    cost = complexity * 20_000
    
    # Recovery: We expect to recover 'feasibility_factor' of the TAP
    gross_impact = tap * feasibility_factor
    
    net_value = gross_impact - cost
    roi_multiple = gross_impact / cost if cost > 0 else 0
    
    return {{
        "impact_usd": round(gross_impact, 2),
        "cost_usd": cost,
        "net_strategic_value": round(net_value, 2),
        "roi_str": f"{{round(roi_multiple, 1)}}x"
    }}

result = calculate_roi(tap={tap_value}, complexity={complexity})
print(json.dumps(result))
"""
        math_output = python_repl.run(python_script)
        try:
            math_json = json.loads(math_output)
        except:
            math_json = {"impact_usd": 0, "net_strategic_value": 0, "roi_str": "N/A"}

        # 4. Final Synthesis
        recommendations.append({
            "project_title": selected_project['title'],
            "impact_usd": math_json.get("impact_usd"),
            "feasibility_score": 8, # Simplified for now
            "market_context": market_context[:300] + "...",
            "technical_spec": selected_project.get("description", ""),
            "roi_metric": math_json.get("roi_str"),
            "net_strategic_value": math_json.get("net_strategic_value")
        })

    # Sort by Net Strategic Value
    recommendations.sort(key=lambda x: x["net_strategic_value"], reverse=True)
    
    print(f"Generated {len(recommendations)} enriched recommendations.")
    return {"recommendations": recommendations}
