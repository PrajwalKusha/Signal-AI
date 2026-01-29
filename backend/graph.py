from langgraph.graph import StateGraph, END
from state import AgentState
from agents.analyst import analyst_agent
from agents.investigator import investigator_agent
from agents.strategist import strategist_agent
from agents.ghostwriter import ghostwriter_agent

def create_graph():
    workflow = StateGraph(AgentState)

    # Add Nodes
    workflow.add_node("analyst", analyst_agent)
    workflow.add_node("investigator", investigator_agent)
    workflow.add_node("strategist", strategist_agent)
    workflow.add_node("ghostwriter", ghostwriter_agent)

    # Add Edges (Linear flow for V1)
    workflow.set_entry_point("analyst")
    workflow.add_edge("analyst", "investigator")
    workflow.add_edge("investigator", "strategist")
    workflow.add_edge("strategist", "ghostwriter")
    workflow.add_edge("ghostwriter", END)

    return workflow.compile()
