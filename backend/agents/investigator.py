import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from state import AgentState, ContextInsight

def investigator_agent(state: AgentState):
    """
    Investigator Agent: Context Seeker.
    1. Reads the anomalies from the Analyst.
    2. Scans the 'context_data_path' (txt file).
    3. Uses LLM to find relevant explanations/events for each anomaly.
    """
    print("--- Investigator Agent: Searching Internal Context (Dynamic) ---")
    
    anomalies = state.get("anomalies", [])
    context_path = state["context_data_path"]
    insights = []
    
    if not anomalies:
        print("No anomalies to investigate.")
        return {"context_insights": []}

    try:
        with open(context_path, "r") as f:
            context_text = f.read()
    except Exception as e:
        print(f"Error reading context file: {e}")
        return {"context_insights": []}

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("No API Key. Returning empty insights.")
        return {"context_insights": []}

    llm = ChatOpenAI(temperature=0, model="gpt-4-turbo")

    # Group anomalies to ask in one go, or loop. Looping is safer for detailed retrieval.
    for signal in anomalies:
        prompt = f"""
        You are an Investigator Agent. 
        
        The Analyst has detected this anomaly:
        Type: {signal['type']}
        Description: {signal['description']}
        Segment: {signal['segment']}
        Metric Value: {signal['value']}
        
        Search the following Internal Logs/Context for any specific events, meeting notes, or emails that explain WHY this is happening.
        Focus on specific project names, acquisitions, or operational changes.
        
        Internal Logs:
        \"\"\"
        {context_text[:10000]} 
        \"\"\"
        (Note: Text truncated to first 10k chars for efficiency)

        If you find a relevant explanation, return a JSON object. If not, return null.
        Schema:
        {{
            "source": "e.g. Slack #sales-news or Email from CEO",
            "content": "One sentence summary of the finding.",
            "date": "YYYY-MM-DD (if found)",
            "relevance_score": 0.95
        }}
        """
        
        try:
            response = llm.invoke([HumanMessage(content=prompt)])
            content = response.content.strip()
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "")
            
            if "null" in content.lower() and len(content) < 10:
                continue
                
            data = None
            # Simple check to parse JSON
            import json
            data = json.loads(content)
            
            if data:
                data["signal_id"] = signal["id"]
                insights.append(data)
                
        except Exception as e:
            print(f"Investigator LLM Error for {signal['id']}: {e}")

    print(f"Found {len(insights)} insights.")
    return {"context_insights": insights}
