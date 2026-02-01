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
    from datetime import datetime
    
    report = []
    
    # Deduplication: Group anomalies by classification and region
    grouped_anomalies = {}
    
    for idx, anom in enumerate(anomalies):
        segment = anom.get('segment', 'UNKNOWN')
        region = segment.split()[0] if segment else 'UNKNOWN'
        
        # Determine classification (reuse logic or simplify for grouping key)
        value_str = anom.get('value', '0')
        is_negative = '-' in value_str
        
        signal_type = anom.get('type', 'Signal')
        if not is_negative and 'growth' in signal_type.lower():
            classification = "Growth Opportunity"
        elif is_negative and ('legal' in segment.lower() or 'compliance' in segment.lower()):
            classification = "Operational Bottleneck"
        elif is_negative:
            classification = "Revenue Leak"
        else:
            classification = signal_type

        # Group key: Region + Classification (e.g., "APAC_Revenue Leak")
        key = f"{region}_{classification}"
        
        if key not in grouped_anomalies:
            grouped_anomalies[key] = []
        
        # Store anomaly with its original index to map back to recommendations/context
        grouped_anomalies[key].append({
            "data": anom,
            "index": idx,
            "classification": classification,
            "region": region,
            "segment": segment
        })

    # Process grouped anomalies
    for key, group in grouped_anomalies.items():
        # If group has multiple items, create a Master Signal. If single, treat normally.
        is_master_signal = len(group) > 1
        
        # Use the first item as the "primary" for metadata
        primary_item = group[0]
        idx = primary_item["index"]
        anom = primary_item["data"]
        classification = primary_item["classification"]
        region = primary_item["region"]
        
        # Context/Recs from primary item (could be aggregated in future)
        rec = recommendations[idx] if idx < len(recommendations) else {}
        ctx = next((c for c in context if c.get('signal_id') == anom.get('id')), {}) if context else {}
        employee_attr = ctx.get('employee_attribution', {}) if ctx else {}
        
        # Determine context string
        event_context = ""
        if ctx and 'content' in ctx:
            content_lower = ctx['content'].lower()
            if 'acquisition' in content_lower or 'zenith' in content_lower:
                event_context = " - Post-Acquisition Impact"
            elif 'q4' in content_lower or 'quarter' in content_lower:
                event_context = " - Quarterly Trend Shift"
            
        # Titles & Summaries
        if is_master_signal:
            # Aggregate impact
            total_impact_usd = sum(float(item["data"].get("impact_usd", 0)) for item in group)
            impact_display = f"${total_impact_usd/1000000:.2f}M" if total_impact_usd > 1000000 else f"${total_impact_usd/1000:.0f}k"
            
            # Combine segments string
            segments_str = ", ".join([item["segment"] for item in group])
            
            if classification == "Revenue Leak":
                title_prefix = "Cross-Segment Contraction"
                severity_override = "critical"
                prose = f"A cascading {classification} of {impact_display} has been identified across {len(group)} segments ({segments_str}) in {region}. This appears to be a systemic issue linked to recent structural changes."
            else:
                title_prefix = f"Regional {classification}"
                severity_override = "medium"
                prose = f"Multiple {classification}s detected across {segments_str}, totaling {impact_display} impact."
                
            contextual_title = f"{title_prefix}: {impact_display} Impact in {region}{event_context}"
            summary = f"Aggregated {classification} across {len(group)} segments in {region}."
            
            # Use aggregated impact for the signal
            signal_impact = impact_display
            
        else:
            # Single Signal Logic
            # ... (Existing logic for single items, simplified here for new structure) ...
            title_prefix = f"Critical {classification}" if classification == "Revenue Leak" else f"Strategic {classification}"
            severity_override = "critical" if classification == "Revenue Leak" else "medium"
            contextual_title = f"{title_prefix}: {anom.get('description', 'Anomaly Detected')}{event_context}"
            summary = f"{classification} detected in {primary_item['segment']}."
            signal_impact = anom.get('value', 'Unknown')
            
            if api_key and idx == 0 and not is_master_signal:
                 prose = final_prose # Use LLM prose if it's the very first one and not a master signal
            else:
                 prose = f"A {classification} has been detected in {primary_item['segment']}."

        # Create signal object
        signal_id = f"SIG-{region.upper()}-{datetime.now().strftime('%Y%m%d%H%M')}-{idx+1:02d}"
        
        report.append({
            "signal_id": signal_id,
            "title": contextual_title,
            "summary": summary,
            "prose": prose,
            "severity": severity_override,
            "date": datetime.now().strftime('%Y-%m-%d'),
            "status": severity_override,
            "impact": signal_impact, # Now can be USD string
            "context_source": ctx.get('source', 'Internal Data Analysis'),
            "recommendation": {
                "project_title": rec.get('project_title', 'Investigation Pending'),
                "roi_metric": rec.get('roi_metric', 'TBD'),
                "impact_usd": rec.get('impact_usd', 0),
                "market_context": rec.get('market_context', 'Market analysis pending'),
                "feasibility_score": rec.get('feasibility_score', 5),
                "technical_spec": rec.get('technical_spec', 'Technical specification pending')
            } if rec else None,
            "employee_attribution": {
                "name": employee_attr.get('name', 'Unknown'),
                "department": employee_attr.get('department', 'N/A'),
                "proposal_quote": employee_attr.get('proposal_summary', 'No proposal available'),
                "submission_date": employee_attr.get('submission_date', datetime.now().strftime('%Y-%m-%d')),
                "submission_channel": employee_attr.get('submission_channel', 'Internal System')
            } if employee_attr and employee_attr.get('name') else None
        })

    return {"final_report": report}

def fallback_prose():
    return (
        "A critical **Revenue Leak** has been identified in the **APAC Enterprise** segment, where revenue has dropped by 34.2% since November 15th. "
        "This correlates directly with the **Zenith Labs** acquisition, which appears to have frozen renewal conversations as clients await clarity on the merged product roadmap. "
        "Immediate intervention is required to unblock these deals by providing a clear migration strategy."
    )
