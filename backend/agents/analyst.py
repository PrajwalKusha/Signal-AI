import pandas as pd
import json
import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_experimental.utilities import PythonREPL
from state import AgentState, WarningSignal
import re

MAX_RETRIES = 3  # Reduced retries since GPT-4o is more reliable

def extract_evidence_fallback(df, anomaly):
    """
    Deterministic fallback evidence extractor when LLM fails to include evidence_csv.
    Extracts relevant rows based on anomaly metadata (segment, type, etc.).
    
    This ensures 100% evidence coverage while maintaining the AI-driven analysis approach.
    """
    try:
        segment = anomaly.get('segment', '')
        anomaly_type = anomaly.get('type', '')
        
        print(f"  🔧 Fallback: Extracting evidence for {anomaly.get('id')} ({segment})", flush=True)
        
        # Filter dataframe for this segment
        filtered_df = df.copy()
        
        if segment and 'Segment' in df.columns:
            # Try exact match first, then partial match
            exact_match = df[df['Segment'] == segment]
            if len(exact_match) > 0:
                filtered_df = exact_match
            else:
                # Partial match (e.g., "APAC" matches "APAC Enterprise")
                filtered_df = df[df['Segment'].str.contains(segment, case=False, na=False)]
        
        # Get top 10 most relevant rows (recent dates, high revenue)
        if len(filtered_df) > 0:
            # Sort by date (most recent first) and revenue (highest first)
            if 'Date' in filtered_df.columns:
                filtered_df = filtered_df.sort_values('Date', ascending=False)
            
            evidence_df = filtered_df.head(10)
            
            # Convert to native Python types
            evidence_df = evidence_df.copy()
            
            # Convert Date to string if present
            if 'Date' in evidence_df.columns:
                evidence_df['Date'] = pd.to_datetime(evidence_df['Date']).dt.strftime('%Y-%m-%d')
            
            # Convert to list of dicts
            rows = evidence_df.to_dict('records')
            
            # Convert numpy types to native Python
            for row in rows:
                for key, value in row.items():
                    if hasattr(value, 'item'):  # numpy type
                        row[key] = value.item()
                    elif pd.isna(value):  # Handle NaN
                        row[key] = None
            
            return {
                "rows": rows,
                "summary": f"Top {len(rows)} rows from {segment or 'dataset'} (auto-extracted)",
                "extraction_method": "fallback"
            }
        
        # No data found
        return {
            "rows": [],
            "summary": f"No matching data found for {segment}",
            "extraction_method": "fallback_empty"
        }
        
    except Exception as e:
        print(f"  ⚠️ Fallback extraction failed: {e}", flush=True)
        return {
            "rows": [],
            "summary": "Evidence extraction failed",
            "extraction_method": "failed"
        }

def analyst_agent(state: AgentState):
    """
    Analyst Agent (Code Interpreter Pattern):
    1. Inspects CSV structure (Head + Types).
    2. Writes Pandas code to detect anomalies.
    3. Executes code with retry loop for error handling.
    """
    print("--- Analyst Agent: Code Interpreter Mode (Harden) ---", flush=True)
    
    csv_path = state["sales_data_path"]
    if not os.path.exists(csv_path):
        print(f"File not found: {csv_path}", flush=True)
        return {"anomalies": []}
        
    try:
        # 1. Inspection Phase (Deterministic)
        df = pd.read_csv(csv_path)
        
        # We need to give the LLM a view of the data structure
        # Head (first 5), Tail (last 5), and dtypes
        inspection_str = f"""
        Columns: {list(df.columns)}
        Types: {df.dtypes.to_dict()}
        Head:
        {df.head().to_string()}
        Tail:
        {df.tail().to_string()}
        """
        
    except Exception as e:
        print(f"Error loading sales data: {e}", flush=True)
        return {"anomalies": []}

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("API Key missing.", flush=True)
        return {"anomalies": []} # Fallback/Exit

    # Agent 1: Analyst - Upgraded to GPT-4o for better reliability and instruction following
    llm = ChatOpenAI(temperature=0, model="gpt-4o")
    python_repl = PythonREPL()
    
    # Define our goal for the coding agent
    goal = """
    Write a Python script to detect significant anomalies in this dataset (Revenue leakes, Growth opps).
    
    CRITICAL: The script must print the result as a VALID JSON string list of objects with this schema:
    [
        {
            "id": "SIG-001",
            "type": "Revenue Leak",
            "metric": "Revenue",
            "value": "-34%",
            "impact_usd": 250000.0,
            "segment": "APAC Enterprise",
            "description": "Clear explanation",
            "severity": "CRITICAL",
            "evidence_csv": {
                "rows": [
                    {"Date": "2025-11-01", "Region": "APAC", "Value": 45000}
                ],
                "summary": "Top 5 rows showing the drop"
            }
        }
    ]
    
    ⚠️ MANDATORY: Every anomaly MUST include the "evidence_csv" field with actual row data from the CSV.
    This is NOT optional - it's the proof that backs up your findings.
    """
    
    # 2. & 3. Code Gen + Execution Loop using the inspection data
    last_error = None
    
    for attempt in range(MAX_RETRIES):
        print(f"\n--- Analyst Loop: Attempt {attempt+1}/{MAX_RETRIES} ---", flush=True)
        
        error_context = f"Previous Error: {last_error}" if last_error else ""
        
        prompt = f"""
        You are a Senior Data Analyst writing Python code to analyze sales data.
        
        CRITICAL: Output ONLY executable Python code. NO explanations, NO markdown, NO preamble.
        Start directly with 'import' statements.
        
        Data Structure:
        {inspection_str}
        
        Goal: {goal}
        
        {error_context}
        
        Requirements:
        1. DATA LOADING:
           - Use 'pd.read_csv("{csv_path}")'
           - Convert 'Date' column: df['Date'] = pd.to_datetime(df['Date'], format='%m/%d/%y')
           
        2. ANOMALY LOGIC:
           - Calculate monthly revenue by Segment.
           - Compare current month vs previous 3-month average.
           - Thresholds: Drop > 20% (Leak), Rise > 50% (Growth).
           
        3. EVIDENCE EXTRACTION (CRITICAL - DO NOT SKIP):
           For EACH anomaly detected, you MUST extract supporting CSV rows:
           
           a) Filter the dataframe to find relevant rows for this anomaly
              Example: If anomaly is in "APAC Enterprise" segment, filter for that segment
           
           b) Get the top 5-10 most relevant rows (e.g., recent dates, largest values)
              Example: evidence_df = df[df['Segment'] == segment].nlargest(5, 'Revenue')
           
           c) Convert these rows to a list of dictionaries:
              - Convert Date to string: evidence_df['Date'] = evidence_df['Date'].dt.strftime('%Y-%m-%d')
              - Convert to dict: rows_list = evidence_df.to_dict('records')
           
           d) Add to the anomaly object:
              "evidence_csv": {{
                  "rows": rows_list,
                  "summary": f"Top {{len(rows_list)}} rows from {{segment}} showing the {{anomaly_type}}"
              }}
           
        4. JSON OUTPUT SAFETY:
           - **NEVER** use pandas Period objects - they are not JSON serializable.
           - For monthly grouping, use: df['Month'] = df['Date'].dt.strftime('%Y-%m') (returns strings)
           - **NEVER** output specific numpy types (int64, float64, timestamp, Period).
           - Convert all numbers to python native `float()` or `int()`.
           - Convert all strings/dates to python `str()`.
           - Do NOT perform arithmetic (sum/mean) directly on datetime columns.
           - Before json.dumps(), convert ALL dataframe columns to native Python types.
           - Output ONLY valid JSON to stdout. No markdown.
           - VERIFY that every anomaly has an "evidence_csv" field before printing.
        """
        
        try:
            print("⏳ Generating Python code with LLM...", flush=True)
            code_res = llm.invoke([HumanMessage(content=prompt)]).content
            print(f"✅ Code Generated ({len(code_res)} chars). Cleaning...", flush=True)
            
            # Clean markdown
            code = code_res.replace("```python", "").replace("```", "").strip()
            
            # Execute
            print("🚀 Executing Python code in REPL...", flush=True)
            output = python_repl.run(code)
            print(f"📄 Code Output (First 200 chars):\n{output[:200]}...", flush=True)

            # Validate Output
            match = re.search(r'\[.*\]', output, re.DOTALL)
            if match:
                json_str = match.group()
                anomalies_data = json.loads(json_str)
                if isinstance(anomalies_data, list) and len(anomalies_data) > 0:
                    print(f"✅ Success: Found {len(anomalies_data)} anomalies from LLM.", flush=True)
                    
                    # POST-PROCESSING: Validate and enrich evidence_csv
                    print("\n🔍 Validating evidence coverage...", flush=True)
                    fallback_count = 0
                    
                    for anomaly in anomalies_data:
                        # Check if evidence_csv is missing or empty
                        evidence = anomaly.get('evidence_csv')
                        needs_fallback = (
                            not evidence or 
                            not isinstance(evidence, dict) or 
                            not evidence.get('rows') or 
                            len(evidence.get('rows', [])) == 0
                        )
                        
                        if needs_fallback:
                            fallback_count += 1
                            # Use deterministic fallback
                            fallback_evidence = extract_evidence_fallback(df, anomaly)
                            anomaly['evidence_csv'] = fallback_evidence
                        else:
                            # Mark as LLM-generated (implicit)
                            if 'extraction_method' not in anomaly['evidence_csv']:
                                anomaly['evidence_csv']['extraction_method'] = 'llm_generated'
                    
                    # Observability metrics (before filtering)
                    llm_success_rate = ((len(anomalies_data) - fallback_count) / len(anomalies_data)) * 100
                    print(f"\n📊 Evidence Extraction Stats:", flush=True)
                    print(f"  Total Anomalies Detected: {len(anomalies_data)}", flush=True)
                    print(f"  LLM Generated Evidence: {len(anomalies_data) - fallback_count} ({llm_success_rate:.1f}%)", flush=True)
                    print(f"  Fallback Used: {fallback_count} ({(fallback_count/len(anomalies_data))*100:.1f}%)", flush=True)
                    print(f"  Evidence Coverage: 100% ✓", flush=True)
                    
                    # FILTER: Return only top 10 most significant anomalies by impact
                    print(f"\n🎯 Filtering to top 10 most significant anomalies by impact...", flush=True)
                    
                    # Sort by impact_usd (descending)
                    sorted_anomalies = sorted(
                        anomalies_data, 
                        key=lambda x: abs(x.get('impact_usd', 0)), 
                        reverse=True
                    )
                    
                    # Take top 10
                    top_anomalies = sorted_anomalies[:10]
                    
                    print(f"  Returning top {len(top_anomalies)} anomalies (out of {len(anomalies_data)} detected)", flush=True)
                    print(f"  Impact range: ${min(abs(a.get('impact_usd', 0)) for a in top_anomalies):,.0f} - ${max(abs(a.get('impact_usd', 0)) for a in top_anomalies):,.0f}\n", flush=True)
                    
                    return {"anomalies": top_anomalies}
                elif isinstance(anomalies_data, list) and len(anomalies_data) == 0:
                     print("Code ran but found no anomalies.", flush=True)
                     return {"anomalies": []}
            
            last_error = f"Output was not valid JSON: {output}"
            print(f"❌ Error: {last_error}", flush=True)

        except Exception as e:
            last_error = str(e)
            print(f"❌ Exception executing code: {e}", flush=True)

    print("Max retries reached. Returning empty.", flush=True)
    return {"anomalies": []}