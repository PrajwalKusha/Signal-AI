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

    # Agent 2: Investigator - Rich Context Matching -> gpt-4o
    llm = ChatOpenAI(temperature=0, model="gpt-4o")

    # Group anomalies to ask in one go, or loop. Looping is safer for detailed retrieval.
    for signal in anomalies:
        prompt = f"""
        You are an Investigator Agent with a special focus on employee attribution.
        
        The Analyst has detected this anomaly:
        Type: {signal['type']}
        Description: {signal['description']}
        Segment: {signal['segment']}
        Metric Value: {signal['value']}
        
        Search the following Internal Logs/Context for:
        1. Specific events, meeting notes, or emails that explain WHY this is happening
        2. Employee-submitted ideas or proposals that address this problem
        3. The employee's name, department (if mentioned), and their proposed solution
        
        Focus on specific project names, acquisitions, operational changes, and employee contributions.
        
        Internal Logs:
        \"\"\"
        {context_text[:15000]} 
        \"\"\"
        (Note: Text truncated to first 15k chars for efficiency)

        If you find a relevant explanation, return a JSON object with employee attribution when available.
        
        Schema:
        {{
            "source": "e.g. Slack #product-roadmap or Email from CEO",
            "content": "One sentence summary of the finding.",
            "date": "YYYY-MM-DD (if found)",
            "relevance_score": 0.95,
            "employee_attribution": {{
                "name": "Employee Name (if found in logs)",
                "department": "Department or role (if mentioned, e.g., 'APAC Sales', 'Engineering')",
                "proposal_summary": "Brief summary of their proposed solution (if they submitted one)",
                "validation": "Any validation they provided (e.g., 'interviewed 8 customers')",
                "submission_channel": "Where they submitted it (e.g., 'Slack #product-roadmap')",
                "submission_date": "YYYY-MM-DD (when they submitted the idea)"
            }}
        }}
        
        IMPORTANT: 
        - If no employee attribution is found, set "employee_attribution" to null
        - If you find an employee who flagged the issue OR proposed a solution, extract their details
        - Look for patterns like "Name: message" or "From: Name" in Slack/email entries
        - Extract detailed proposals that include problem statements, solutions, ROI estimates, etc.
        
        Return null if no relevant context is found at all.
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
