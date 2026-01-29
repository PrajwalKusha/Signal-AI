import sys
import os
# Add the current directory to sys.path so we can import 'graph', 'state', etc.
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from graph import create_graph

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

@app.get("/")
def read_root():
    return {"status": "Signals Backend Operational"}

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

@app.post("/api/audit")
async def run_audit(data: dict = None):
    """
    Triggers the multi-agent workflow.
    Accepts optional custom filenames in the body.
    """
    try:
        workflow = create_graph()
        
        # Default paths
        sales_file = "nexusflow_sales_2025_full.csv"
        context_file = "internal_context_dump.txt"
        backlog_file = "transformation_backlog.json"

        # Override if provided
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
        
        result = workflow.invoke(initial_state)
        return {"report": result.get("final_report", [])}
        
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
