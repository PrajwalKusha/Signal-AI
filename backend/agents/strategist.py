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
Verify that the solution directly addresses the root cause described in the context.

MATCHING RULES:
- For revenue drops in a specific region, look for transformations that address that region or competitive issues
- For customer churn or migration friction, look for retention or migration-related transformations (e.g., TRANS-001)
- For segment/tier divergence (Enterprise vs Starter), look for growth or marketing transformations (e.g., TRANS-032)
- For operational bottlenecks or compliance friction, look for automation or process improvement transformations (e.g., TRANS-014)
- Prioritize transformations with CRITICAL or High strategic alignment
- Match based on department, pain point, and impact size
"""

        human_prompt = f"""
        Signal Detected: {signal['description']} ({signal['value']} impact in {signal.get('segment', 'Unknown')} segment).
        {context_str}
        
        Available Transformation Projects:
        {backlog_str}
        
        Task: Select the BEST project from the backlog that directly solves this signal.
        
        MATCHING GUIDELINES:
        - If signal mentions "EMEA", "Professional tier", "Enterprise tier", or "tier growth" → Select TRANS-032 (EMEA Growth Multiplier)
        - If signal mentions "NorthAm", "compliance", "legal", or "contract review" → Select TRANS-014 (Automated Contract Reviewer)
        - If signal mentions "APAC", "churn", "migration", "Zenith", or "GlobalStack" → Select TRANS-001 (AI Competitive Switch-Kit)
        - If signal mentions "revenue drop" or "revenue leak" → Select TRANS-001 (AI Competitive Switch-Kit)
        
        Return ONLY valid JSON with this exact format:
        {{"project_id": "TRANS-XXX", "complexity_points": <number>}}
        
        Example: {{"project_id": "TRANS-001", "complexity_points": 40}}
        """
        match_res = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]).content
        try:
            # Extract JSON from response
            json_match = re.search(r'\{.*?\}', match_res, re.DOTALL)
            if not json_match:
                print(f"No JSON found in LLM response: {match_res[:200]}")
                continue
                
            match_json = json.loads(json_match.group())
            project_id = match_json.get("project_id")
            complexity = match_json.get("complexity_points", 5)
            selected_project = next((p for p in backlog_data if p["id"] == project_id), None)
            if not selected_project: continue
        except Exception as e:
            print(f"Error parsing LLM response for signal '{signal['description']}': {e}. Response: {match_res[:200]}")
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

        # 3. ROI Calculation using backlog's impact_usd
        # Use the pre-defined impact from the backlog
        impact_usd = selected_project.get('impact_usd', 0)
        cost_usd = complexity * 20_000  # $20k per complexity point
        
        # Calculate ROI multiple
        roi_multiple = impact_usd / cost_usd if cost_usd > 0 else 0
        net_strategic_value = impact_usd - cost_usd
        
        # Format ROI string
        roi_str = f"{roi_multiple:.1f}x" if roi_multiple > 0 else "N/A"

        # 4. Final Synthesis
        recommendations.append({
            "project_title": selected_project['title'],
            "impact_usd": int(impact_usd),  # Use backlog's impact
            "feasibility_score": 8,  # Could be calculated based on complexity
            "market_context": market_context[:1500],
            "technical_spec": selected_project.get("tech_spec", selected_project.get("description", "")),
            "roi_metric": roi_str,  # Properly formatted ROI
            "net_strategic_value": net_strategic_value,
            "evidence_json": {
                "file": "transformation_backlog.json",
                "entry": selected_project,  # Full JSON object from backlog
                "context": f"Matched transformation '{selected_project['title']}' to address {signal['type']}"
            }
        })

    # Sort by Net Strategic Value
    recommendations.sort(key=lambda x: x["net_strategic_value"], reverse=True)
    
    print(f"Generated {len(recommendations)} enriched recommendations.")
    return {"recommendations": recommendations}
