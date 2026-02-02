
import sys
import os
import asyncio
import json

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from main import create_graph

# Correct path relative to project root (CWD)
DATA_DIR = os.path.join(os.getcwd(), "data")

initial_state = {
    "sales_data_path": os.path.join(DATA_DIR, "nexusflow_sales_2025_full.csv"),
    "context_data_path": os.path.join(DATA_DIR, "internal_context_dump.txt"),
    "backlog_data_path": os.path.join(DATA_DIR, "transformation_backlog.json"),
    "anomalies": [],
    "context_insights": [],
    "recommendations": [],
    "final_report": []
}

async def run_agent():
    workflow = create_graph()
    results = []
    
    print("--- Starting 3 Runs ---")
    for i in range(3):
        print(f"\nRun #{i+1}...")
        try:
            # Invoke the graph
            result = await workflow.ainvoke(initial_state)
            
            # Extract the final report (signals)
            signals = result.get("final_report", [])
            results.append(signals)
            print(f"Run #{i+1} generated {len(signals)} signals.")
            print(json.dumps(signals, indent=2))
        except Exception as e:
            print(f"Run #{i+1} failed: {e}")
            
    return results

if __name__ == "__main__":
    asyncio.run(run_agent())
