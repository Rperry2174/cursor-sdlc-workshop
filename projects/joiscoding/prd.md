# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Slack Summarizer

**One-line Description:** Connects to your Slack workspace, reads through channels you haven’t read, and gives you a single overview of what’s going on.

**Type:** MCP-powered flow (agent uses Slack MCP; optional small UI or CLI to show/export the summary)

**Goal:** Use it with **your own Slack** — connect once, then get a summary of what’s going on across your channels.

**How we connect: Slack MCP**  
We use the **Slack MCP server** (Model Context Protocol) so Cursor can talk to your Slack workspace. No mock data and no separate OAuth app: you authenticate the Slack MCP once in Cursor (e.g. via the `mcp_auth` tool), then the summarizer uses MCP tools like listing channels and getting channel history to build your overview.

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes**
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!**
- This exercise is about learning the git flow and understanding where Cursor's features fit into the SDLC

### Good Project Ideas

**Pong** — classic paddle-and-ball game
- _Example features:_ scoreboard, sound effects, difficulty/speed settings

**Memory Card Match** — flip cards to find matching pairs
- _Example features:_ move counter, timer, win animation/confetti

**Drawing Pad** — simple canvas you can sketch on
- _Example features:_ color picker, brush size slider, eraser tool

**Typing Speed Game** — type a passage and measure your words per minute
- _Example features:_ WPM display, accuracy tracker, difficulty levels

**Trivia Quiz** — multiple choice questions with score tracking
- _Example features:_ timer per question, category selector, results summary screen

### Bad Project Ideas (Too Big!)
- Anything with a database — tell Cursor to avoid this
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" an API

---

## Base MVP

> Build the minimal working version using your real Slack via MCP.

**What the MVP includes:**
- **Slack MCP connected:** You have the Slack MCP server enabled in Cursor and have authenticated it once (`mcp_auth` for the Slack server) so it’s connected to **your** workspace.
- **Summarizer flow:** A clear way to get your overview — e.g. you ask the agent to “summarize my Slack” (or run a script/prompt that does it). The flow uses MCP tools to:
  - List your channels (e.g. `slack_list_channels` or equivalent).
  - Get recent channel history where relevant (e.g. `slack_get_channel_history`).
  - Produce a short summary (e.g. bullet points per channel: “**#general:** budget meeting moved to 3pm; **#eng:** deploy is green.”).
- **No mock data:** Everything runs against your real Slack via MCP.

**Optional (if you want a UI):** A tiny local page or CLI that displays the summary (the summary can still be produced by the agent/MCP flow; the app just shows or saves it).

**Stretch goals:**
- Filter by channel or date range; export/copy summary to clipboard or file.

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Richer use of Slack MCP (channels + history)
- **Description:** Use MCP tools to list your channels and pull recent history from each (or from channels you care about), then summarize. Ensures the flow covers “what I haven’t read” by focusing on recent activity.
- **Files to create:** A prompt/script or small runner (e.g. in `base_mvp/`) that describes the MCP flow; optionally a `SLACK_SUMMARY_PROMPT.md` or similar so anyone can run “summarize my Slack” the same way.

### Feature 2: Filter by channel or date
- **Description:** Let the user choose which channels to include and/or limit to the last N hours (e.g. “only #eng and #general”, “last 24 hours”). Implement via prompt parameters or a small config.
- **Files to create:** `ChannelFilter.jsx` or `filters.json` / prompt template; wire into how we call MCP or pass options to the summarizer.

### Feature 3: Export or copy summary
- **Description:** One-click copy summary to clipboard or save as a text/markdown file for email or notes.
- **Files to create:** `ExportSummary.jsx` or a small script that takes the summary text and copies/saves it.

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
