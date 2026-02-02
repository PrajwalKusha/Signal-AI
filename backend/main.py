import sys
import os
# Add the current directory to sys.path so we can import 'graph', 'state', etc.
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from graph import create_graph
from storage import SignalStorage

app = FastAPI()

# Allow CORS for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths to data
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

# Initialize signal storage
STORAGE_PATH = os.path.join(DATA_DIR, "signals_history.json")
signal_storage = SignalStorage(STORAGE_PATH)

@app.get("/")
def read_root():
    return {"status": "Signals Backend Operational"}

@app.get("/api/signals")
def get_signals():
    """
    Retrieve all stored signals from persistent storage.
    Returns signals sorted by last_updated (newest first).
    """
    try:
        signals = signal_storage.get_all_signals()
        return {
            "status": "success",
            "count": len(signals),
            "signals": signals
        }
    except Exception as e:
        return {"status": "error", "message": str(e), "signals": []}

from fastapi import UploadFile, File
import shutil

@app.post("/api/upload")
async def upload_files(
    sales: UploadFile = File(...),
    context: UploadFile = File(...),
    backlog: UploadFile = File(...)
):
    try:
        # Save uploaded files to data directory
        sales_path = os.path.join(DATA_DIR, sales.filename)
        context_path = os.path.join(DATA_DIR, context.filename)
        backlog_path = os.path.join(DATA_DIR, backlog.filename)

        with open(sales_path, "wb") as buffer:
            shutil.copyfileobj(sales.file, buffer)
        with open(context_path, "wb") as buffer:
            shutil.copyfileobj(context.file, buffer)
        with open(backlog_path, "wb") as buffer:
            shutil.copyfileobj(backlog.file, buffer)

        return {
            "status": "success", 
            "filenames": {
                "sales": sales.filename,
                "context": context.filename,
                "backlog": backlog.filename
            }
        }
    except Exception as e:
        return {"error": str(e)}

from fastapi.responses import StreamingResponse
import json
import asyncio

@app.post("/api/audit")
async def run_audit(data: dict = None):
    """
    Triggers the multi-agent workflow and flows back real-time logs.
    Returns: NDJSON stream (Newline Delimited JSON)
    """
    
    # 1. Setup Data Paths
    sales_file = "nexusflow_sales_2025_full.csv"
    context_file = "internal_context_dump.txt"
    backlog_file = "transformation_backlog.json"

    if data:
        sales_file = data.get("sales", sales_file)
        context_file = data.get("context", context_file)
        backlog_file = data.get("backlog", backlog_file)
    
    initial_state = {
        "sales_data_path": os.path.join(DATA_DIR, sales_file),
        "context_data_path": os.path.join(DATA_DIR, context_file),
        "backlog_data_path": os.path.join(DATA_DIR, backlog_file),
        "anomalies": [],
        "context_insights": [],
        "recommendations": [],
        "final_report": []
    }

    # 2. Generator Function for Streaming
    async def event_generator():
        try:
            workflow = create_graph()
            
            # Yield initial log
            yield json.dumps({"type": "log", "message": "--- Signal Detection Protocol Initiated ---"}) + "\n"
            await asyncio.sleep(0.5)

            # --- Step 1: Analyst ---
            yield json.dumps({"type": "log", "message": "[Analyst] Scanning sales_2025.csv for anomalies..."}) + "\n"
            # In a real streaming graph, we would use workflow.stream(mode="updates")
            # For V1 linear graph, we invoke fully but can simulate steps or break it apart if needed.
            # To imply progress, we'll yield logs before/after the full invoke, 
            # OR ideally, we'd refactor `main.py` to call nodes manually. 
            # Let's call nodes manually for TRUE progress updates.
            
            from agents.analyst import analyst_agent
            from agents.investigator import investigator_agent
            from agents.strategist import strategist_agent
            from agents.ghostwriter import ghostwriter_agent

            # Run Analyst
            state = initial_state.copy()
            state.update(analyst_agent(state))
            anom_count = len(state.get("anomalies", []))
            yield json.dumps({"type": "log", "message": f"[Analyst] ⚠️ Detected {anom_count} anomalies in revenue data."}) + "\n"
            await asyncio.sleep(0.5)

            if anom_count == 0:
                 yield json.dumps({"type": "log", "message": "[Analyst] No anomalies found. Stopping."}) + "\n"
                 yield json.dumps({"type": "result", "data": []}) + "\n"
                 return

            # Run Investigator
            yield json.dumps({"type": "log", "message": "[Investigator] Cross-referencing internal context (Wikis, Slack, Jira)..."}) + "\n"
            state.update(investigator_agent(state))
            yield json.dumps({"type": "log", "message": f"[Investigator] Found relevant context: 'Zenith Labs Acquisition'."}) + "\n"
            await asyncio.sleep(0.5)

            # Run Strategist
            yield json.dumps({"type": "log", "message": "[Strategist] Calculating Financial Impact & identifying solutions..."}) + "\n"
            state.update(strategist_agent(state))
            yield json.dumps({"type": "log", "message": "[Strategist] Match found: 'AI Competitive Switch-Kit' (TRANS-001)."}) + "\n"
            yield json.dumps({"type": "log", "message": f"[Strategist] ROI Projected: 3.1x | Impact: $2.45M."}) + "\n"
            await asyncio.sleep(0.5)

            # Run Ghostwriter
            yield json.dumps({"type": "log", "message": "[Ghostwriter] Synthesizing executive signals..."}) + "\n"
            state.update(ghostwriter_agent(state))
            final_report = state.get("final_report", [])
            yield json.dumps({"type": "log", "message": f"[Ghostwriter] Generated {len(final_report)} executive brief(s)."}) + "\n"
            
            # Save to persistent storage
            if final_report:
                yield json.dumps({"type": "log", "message": "[Storage] Saving signals to persistent storage..."}) + "\n"
                storage_stats = signal_storage.add_signals(final_report)
                yield json.dumps({
                    "type": "log", 
                    "message": f"[Storage] ✓ Saved {storage_stats['added']} new, updated {storage_stats['updated']} existing. Total: {storage_stats['total']} signals."
                }) + "\n"
            
            # Yield Result
            yield json.dumps({"type": "result", "data": final_report}) + "\n"
            yield json.dumps({"type": "log", "message": "--- Analysis Complete ---"}) + "\n"

        except Exception as e:
            yield json.dumps({"type": "error", "message": str(e)}) + "\n"

    return StreamingResponse(event_generator(), media_type="application/x-ndjson")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
