PRD: "Signal" – Enterprise Transformation Intelligence Platform
1. Executive Summary
Signal is a proactive "Radar" for enterprise executives. It shifts the paradigm from reactive dashboards to proactive, agentic intelligence. By synthesizing structured financial data, unstructured internal communications, and a transformation backlog, Signal identifies "Revenue Leaks," "Operational Bottlenecks," and "Growth Opportunities" before they appear in quarterly reports.

2. The Data Stack (Source of Truth)
The application must ingest and synchronize three core data types located in the /data directory:

nexusflow_sales_2025_full.csv: 1,000 rows of transactional data (Date, Region, Account, Deal Size, Rep).

internal_context_dump.txt: Unstructured logs (Slack, Email, Memos) providing the "Why" behind financial anomalies.

transformation_backlog.json: A list of potential AI transformation projects with ROI and complexity metrics.

3. Technical Architecture: LangGraph Multi-Agent Workflow
The backend must be built using LangGraph to manage a stateful, cyclical reasoning process.

State Schema (AgentState)
The shared state must track:

anomalies: List of statistical outliers found in sales data.

context_insights: Relevant text snippets from internal logs.

recommendations: Matched projects from the transformation backlog.

final_report: The executive-level prose for the UI.

The Nodes (The Agents)
Analyst Agent (The Quant): Uses pandas to detect three specific signals:

-34.2% Revenue Drop in APAC Enterprise (Post-Nov 15).

+139.8% Growth in EMEA Professional (Post-July).

Increased sales cycle friction in NorthAm.

Investigator Agent (The Context Seeker): Performs semantic search on the .txt file to link signals to events (e.g., "Zenith Labs Acquisition").

Strategist Agent (The Solution Architect): Cross-references identified problems with the .json backlog to find high-ROI fixes (e.g., "TRANS-001: AI Switch-Kit").

Ghostwriter Agent (The Supervisor): Synthesizes all findings into a high-level, two-paragraph executive summary per signal.

4. Frontend Requirements (Next.js + Tailwind)
The UI must be minimalist, high-density, and executive-focused.

Core Components:
Morning Brief Dashboard: A clean feed showing exactly 3 "Signal Cards."

Signal Card UI:

Status Indicators: Red (Critical/Leak), Green (Opportunity), Yellow (Watch/Bottleneck).

KPIs: Bold display of "Impact USD" and "AI Confidence %."

"Understand This" Button: Expands the card to show the AI-generated prose.

"Act on This" Panel: Displays the specific build specification from the transformation backlog, including estimated "Tenex Story Points."

5. User Stories & "The Red Thread"
For the demo, the following "Red Thread" must be flawlessly executed:

Detection: Analyst finds the APAC revenue drop in the CSV.

Diagnosis: Investigator finds the Slack messages about the Zenith Labs acquisition in the TXT.

Prescription: Strategist recommends the "AI Competitive Switch-Kit" from the JSON.

Outcome: The CEO sees a single card that identifies a $2.45M risk and offers an immediate solution.

6. Definition of Success
Mag7-Level Prose: No bullet points; the AI must write like a senior consultant.

Entity Integrity: "Phoenix Biotech" and "Zenith Labs" must be correctly identified across all files.

Frictionless UX: A "One-Click Audit" experience for the sample dataset.