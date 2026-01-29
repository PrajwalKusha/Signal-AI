from typing import List, Dict, Any, Optional, TypedDict

class WarningSignal(TypedDict):
    id: str
    type: str  # "Revenue Drop", "Growth", "Friction"
    metric: str
    value: str # e.g. "-34.2%"
    segment: str
    description: str
    severity: str # "CRITICAL", "HIGH", "MEDIUM" (Mapped to Red/Green/Yellow)

class ContextInsight(TypedDict):
    signal_id: str # Links back to the anomalies
    source: str # "Slack", "Email", etc.
    content: str
    date: str
    relevance_score: float

class Recommendation(TypedDict):
    project_title: str
    impact_usd: float
    feasibility_score: int # 1-10
    market_context: str
    technical_spec: str
    roi_metric: str # Kept for backward compatibility if needed, or derived
    net_strategic_value: float # Sorting metric

class AgentState(TypedDict):
    # Input
    sales_data_path: str
    context_data_path: str
    backlog_data_path: str
    
    # Internal State
    anomalies: List[WarningSignal]
    context_insights: List[ContextInsight]
    recommendations: List[Recommendation]
    
    # Output
    final_report: List[Dict[str, Any]] # Structure for the UI
