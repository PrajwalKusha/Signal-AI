import pandas as pd
import json
import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_experimental.utilities import PythonREPL
from state import AgentState, WarningSignal
import re

MAX_RETRIES = 3

def analyst_agent(state: AgentState):
    """
    Analyst Agent (Code Interpreter Pattern):
    1. Inspects CSV structure (Head + Types).
    2. Writes Pandas code to detect anomalies.
    3. Executes code with retry loop for error handling.
    """
    print("--- Analyst Agent: Code Interpreter Mode ---")
    
    csv_path = state["sales_data_path"]
    if not os.path.exists(csv_path):
        print(f"File not found: {csv_path}")
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
        print(f"Error loading sales data: {e}")
        return {"anomalies": []}

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {"anomalies": []} # Fallback/Exit

    # Agent 1: Analyst - Interpreter (Fast, Logic-focused) -> gpt-4o-mini
    llm = ChatOpenAI(temperature=0, model="gpt-4o-mini")
    python_repl = PythonREPL()
    
    # Define our goal for the coding agent
    goal = """
    Write a Python script to detect significant anomalies in this dataset.
    - If it's time-series data: look for drops > 20% or spikes > 50% month-over-month.
    - If it's categorical: look for segments significantly under/over-performing average.
    - If it involves cycle times: look for increases (friction).
    
    CRITICAL: The script must print the result as a VALID JSON string list of objects with this schema:
    [
        {
            "id": "SIG-001",
            "type": "Revenue Leak" | "Growth Opportunity" | "Operational Bottleneck",
            "metric": "Revenue" | "Sales Cycle",
            "value": "-34%" or "+12 Days",
            "segment": "APAC Enterprise",
            "description": "Clear explanation",
            "severity": "CRITICAL" | "OPPORTUNITY" | "WATCH"
        }
    ]
    """
    
    # 2. & 3. Code Gen + Execution Loop using the inspection data
    last_error = None
    
    for attempt in range(MAX_RETRIES):
        print(f"Attempt {attempt+1}/{MAX_RETRIES}")
        
        error_context = f"Previous Error: {last_error}" if last_error else ""
        
        prompt = f"""
        You are a Senior Data Analyst. 
        Data Structure:
        {inspection_str}
        
        Goal: {goal}
        
        {error_context}
        
        Requirements:
        - Use 'pd.read_csv("{csv_path}")' to load the data.
        - Convert date columns using: pd.to_datetime(df['Date'], format='%m/%d/%y')
        - When calculating time differences, use .dt.days on the timedelta, not .days directly
        - Use .iloc[] for positional indexing, not bracket notation
        - Always use .values[0] or .iloc[0] to extract scalar values from Series
        - Calculate 'impact_usd' as the exact dollar difference between the current period and the baseline
        - Use a 3-month rolling average or previous period as the baseline
        - Output ONLY valid JSON to stdout (print).
        - JSON must include: id, type, metric, value (percentage), impact_usd (number), segment, description, severity
        - Do not output markdown blocks or explanations, ONLY the code.
        - Focus on revenue trends by region and product tier
        """
        
        try:
            # Generate Code
            code_res = llm.invoke([HumanMessage(content=prompt)]).content
            
            # Clean markdown
            code = code_res.replace("```python", "").replace("```", "").strip()
            
            # Execute
            output = python_repl.run(code)
            print(f"Code Output: {output[:100]}...")

            # Validate Output
            # We expect a JSON list
            match = re.search(r'\[.*\]', output, re.DOTALL)
            if match:
                json_str = match.group()
                anomalies_data = json.loads(json_str)
                if isinstance(anomalies_data, list) and len(anomalies_data) > 0:
                    return {"anomalies": anomalies_data} # Success!
                elif isinstance(anomalies_data, list) and len(anomalies_data) == 0:
                     print("Code ran but found no anomalies. Relaxing constraints not implemented yet.")
                     return {"anomalies": []} # Code ran but found nothing
            
            last_error = f"Output was not valid JSON: {output}"

        except Exception as e:
            last_error = str(e)
            print(f"Error executing code: {e}")

    print("Max retries reached. Returning empty.")
    return {"anomalies": []}

