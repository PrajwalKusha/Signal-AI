import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from state import AgentState

def ghostwriter_agent(state: AgentState):
    """
    Ghostwriter Agent: Synthesizes findings into Executive Prose.
    Uses OpenAI if available, otherwise falls back to a high-quality template.
    """
    print("--- Ghostwriter Agent: Synthesizing Report ---")
    
    anomalies = state.get("anomalies", [])
    context = state.get("context_insights", [])
    recommendations = state.get("recommendations", [])
    
    # Check for API Key
    api_key = os.getenv("OPENAI_API_KEY")
    
    if api_key:
        # LLM Synthesis
        try:
            # Agent 4: Ghostwriter - Polished Narrative -> gpt-4o
            llm = ChatOpenAI(temperature=0, model="gpt-4o")
            
            
            rec = recommendations[0] if recommendations else {}
            ctx = context[0] if context else {}
            employee_attr = ctx.get('employee_attribution', {}) if ctx else {}
            
            prompt = f"""
            You are a Senior Strategic Advisor to the CEO.
            Write a "Transformation Investment Memo" - a decision-ready brief that recognizes employee contributions.
            
            **SIGNAL DETECTED:**
            {anomalies[0]['description'] if anomalies else 'No major signal'}
            
            **INTERNAL CONTEXT:**
            {ctx.get('content', 'No context found.')}
            
            **EMPLOYEE CONTRIBUTION:**
            {f"Name: {employee_attr.get('name', 'Unknown')}" if employee_attr else "No employee attribution found"}
            {f"Department: {employee_attr.get('department', 'N/A')}" if employee_attr and employee_attr.get('department') else ""}
            {f"Proposal: {employee_attr.get('proposal_summary', 'N/A')}" if employee_attr and employee_attr.get('proposal_summary') else ""}
            {f"Validation: {employee_attr.get('validation', 'N/A')}" if employee_attr and employee_attr.get('validation') else ""}
            
            **STRATEGIC RESPONSE:**
            Product: {rec.get('project_title', 'Investigation Pending')}
            Market Context: {rec.get('market_context', 'N/A')}
            ROI: {rec.get('roi_metric', 'N/A')} (${rec.get('impact_usd', 0):,.0f} impact)
            Feasibility: {rec.get('feasibility_score', 'N/A')}/10
            
            **FORMAT REQUIREMENTS:**
            Write 2-3 paragraphs in this structure:
            
            Paragraph 1 - THE PROBLEM:
            - State the business impact clearly (use the signal data)
            - Mention the root cause if known from context
            - Keep it urgent but professional
            
            Paragraph 2 - THE SOLUTION & RECOGNITION:
            - If an employee proposed a solution, CREDIT THEM BY NAME
            - Example: "**Hiroshi Tanaka** (APAC Sales) identified this issue and proposed..."
            - Summarize their solution approach
            - Mention any validation they did (customer interviews, data analysis, etc.)
            
            Paragraph 3 - THE BUSINESS CASE:
            - State the ROI and financial impact
            - Reference the market context from Tavily research
            - End with a clear recommendation (Approve/Investigate Further/Archive)
            
            **TONE:**
            - Professional, "Mag7" consulting style
            - Bold key entities (employee names, dollar amounts, company names)
            - No bullet points in the prose
            - Make the employee feel recognized and valued
            """
            
            response = llm.invoke([HumanMessage(content=prompt)])
            final_prose = response.content
            
        except Exception as e:
            print(f"LLM Error: {e}. Using fallback.")
            final_prose = fallback_prose()
    else:
        print("No OPENAI_API_KEY found. Using fallback.")
        final_prose = fallback_prose()

    # Construct the final report object for the UI
    report = []
    if anomalies:
        report.append({
            "signal_id": anomalies[0]["id"],
            "title": "Revenue Leak Detected: APAC Enterprise",
            "prose": final_prose,
            "status": anomalies[0]["severity"],
            "impact": anomalies[0]["value"],
            "recommendation": recommendations[0] if recommendations else None
        })
        
        # Add the other two signals with static content for the demo
        report.append({
            "signal_id": "SIG-002",
            "title": "Growth Opportunity: EMEA Professional",
            "prose": "Market analysis indicates a substantial uptake in EMEA Professional services, driven by the recent regulatory changes in the EU. This represents a +139.8% outlier against projected forecasts, suggesting an immediate need to reallocate sales engineering resources to capitalize on this momentum.",
            "status": "Green",
            "impact": "+139.8%",
            "recommendation": None
        })
        
        report.append({
            "signal_id": "SIG-003",
            "title": "Friction Warning: NorthAm Sales Cycle",
            "prose": "Deal velocity in North America has decelerated by 12 days on average, correlating with the introduction of the new compliance module. Early feedback suggests the validation step is overly burdensome, creating a bottleneck that threatens Q4 close rates.",
            "status": "Yellow",
            "impact": "+12 Days",
            "recommendation": None
        })

    return {"final_report": report}

def fallback_prose():
    return (
        "A critical **Revenue Leak** has been identified in the **APAC Enterprise** segment, where revenue has dropped by 34.2% since November 15th. "
        "This correlates directly with the **Zenith Labs** acquisition, which appears to have frozen renewal conversations as clients await clarity on the merged product roadmap. "
        "Immediate intervention is required to unblock these deals by providing a clear migration strategy."
    )
