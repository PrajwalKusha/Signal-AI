# Signals: Enterprise Intelligence Command Center

**Signals** is a real-time strategic anomaly detection platform powered by an autonomous agent swarm. It ingests revenue data, internal context, and market trends to generate actionable business intelligence for executives.

![Signals Dashboard Preview](/public/dashboard-preview.png)

---

## 🚀 Concept
Modern enterprises are drowning in data but starved for liquidity in decision-making. **Signals** solves this by deploying a team of specialized AI agents that continuously monitor, analyze, and synthesize disparate data streams into high-fidelity "Signals"—strategic alerts that require immediate attention.

### The Agent Swarm
Our architecture utilizes a multi-agent system (MAS) powered by **LangGraph**:

1.  **🕵️ Analyst Agent**: Scans raw revenue data (CSV) for statistical anomalies (dips, spikes, churn).
2.  **🔍 Investigator Agent**: Cross-references anomalies with internal context (Wikis, Slack dumps, Jira) to find root causes.
3.  **♟️ Strategist Agent**: Calculates financial impact and pulls real-time market data (via Tavily API) to recommend solutions.
4.  **✍️ Ghostwriter Agent**: Synthesizes all findings into a concise, executive-level briefing.

---

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
-   **Styling**: Tailwind CSS v4 + Motion (Framer Motion)
-   **Components**: Custom "Nexus" Design System (Glassmorphism, Dark UI)
-   **Visualization**: Recharts for data trends

### Backend
-   **Runtime**: Python 3.9+ / FastAPI
-   **Orchestration**: [LangGraph](https://langchain-ai.github.io/langgraph/) (Stateful multi-agent workflows)
-   **AI Models**: OpenAI GPT-4o
-   **Tools**: Tavily (Search), Pandas (Data Analysis)
-   **Deployment**: Docker + AWS Lightsail Container Services

---

## 📂 Project Structure

```bash
signals/
├── backend/                 # FastAPI + LangGraph Agent Server
│   ├── agents/              # Agent definitions (Analyst, Investigator, Strategist...)
│   ├── graph.py             # Agent workflow orchestration
│   ├── main.py              # API Entrypoint
│   └── Dockerfile           # Production container config
├── frontend/                # Next.js Dashboard Client
│   ├── app/                 # App Router pages
│   ├── components/          # UI Components (SignalCard, Sidebar, etc.)
│   └── public/              # Static assets
├── data/                    # Sample data for simulation
└── README.md                # You are here
```

---

## ⚡ Getting Started

### Prerequisites
-   Python 3.10+
-   Node.js 18+
-   Docker (optional, for containerization)
-   OpenAI API Key & Tavily API Key

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file with your keys
# OPENAI_API_KEY=...
# TAVILY_API_KEY=...

# Run Server
python main.py
```
*Backend runs on `http://localhost:8000`*

### 2. Frontend Setup
```bash
cd frontend
npm install

# Run Client
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## ☁️ Deployment

### Backend (AWS Lightsail)
The backend is dockerized and acts as a stateless API agent service.
```bash
docker build --platform linux/amd64 -f backend/Dockerfile -t signals-backend .
aws lightsail push-container-image ...
```

### Frontend (Vercel)
The frontend is a static/serverless Next.js app optimized for Vercel deployment.
-   Connect GitHub Repo
-   Set `NEXT_PUBLIC_API_URL` to your Lightsail endpoint.

---

## 🔮 Roadmap
-   [x] **mvp**: Single-player agent loop
-   [x] **ui**: Glassmorphic "Minority Report" interface
-   [x] **deploy**: AWS + Vercel pipeline
-   [ ] **scale**: Real-time WebSocket streaming
-   [ ] **collab**: Multi-user workspaces

---

© 2026 NexusFlow Inc. Built for the Future of Work.
