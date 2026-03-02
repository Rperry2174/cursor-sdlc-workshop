# Cursor 101 Presentation Cheat Sheet

## Opening (5 min)
- **Reassure the audience**: You don't need to write code to use Cursor effectively
- **Field Engineering support**: FEs are here to help—bring us into meetings anytime, Slack channel: `#team-field-eng`
- **POC structure reminder**: 4-week trial → Cursor 101 (week 1) → Cursor 201 (week 2) → Office hours/reverse demos (weeks 3-4)

---

## The Cursor Ecosystem (3 min)
| Product | What it is |
|---------|------------|
| **IDE** | Main product—where we're focusing today |
| **CLI** | Command line interface (competes with Claude Code, Codex) |
| **Cloud Agents** | Run prompts on VMs in the cloud |
| **BugBot** | Auto-review PRs for bugs |

**Key point**: IDE is still the best place to build software—it's our core focus

---

## IDE Orientation (5 min)
**Four quadrants:**
1. **Left**: File Explorer (your project files)
2. **Center**: File Editor (view/edit code)
3. **Right**: Chat Pane (talk to AI models)
4. **Bottom**: Utilities (terminal, errors, etc.)

**Demo**: Open an empty folder, create `index.html`

---

## Editing Features

### Tab (AI Autocomplete)
- **Powered by**: Fusion (Cursor's own model)—**huge differentiator**
- **What it does**: Predicts your next edit as you type (not just completions—full multi-line edits)
- **Why it's special**:
  - Analyzes your codebase
  - Learns from accepted/rejected suggestions
  - Writes code "in your voice"
  - Top 3 models globally for lines of code generated/day
- **Great entry point** for engineers new to AI coding
- **Demo**: Type `<html>` tag → Tab suggests skeleton → accept with Tab key

### Inline Edit (Cmd+K)
- **How to use**: Highlight code → `Cmd+K` → type a natural language instruction
- **Model agnostic**: Choose from any frontier model (Claude, GPT, Gemini, etc.)
- **Diff interface**: See old code (red) vs new code (green) → Accept/Reject
- **Demo**: Highlight H1 tag → "make this more colorful"

### Terminal Cmd+K
- Press `Cmd+K` in the terminal to describe what you want in plain English
- Cursor translates your intent into the right shell command
- Great for people who don't memorize CLI flags

---

## Chat & Agent

### Chat (Cmd+L)
- **This is where most Cursor engineers live** (95% of code generation)
- **Key capabilities**:
  - Natural language prompts
  - Create/update **multiple files** at once
  - Streaming responses (see it work in real-time)
  - Build up context over multiple prompts
- **Demo**: "Build a multi-page website that is a restaurant directory for Germany"

### Agent Mode (default)
- Autonomous multi-step coding: reads files, writes code, runs commands, fixes errors in a loop
- The agent decides what to read, edit, and run—you just describe the goal
- Can install dependencies, create files, and iterate on linter errors automatically

### Plan Mode
- Read-only collaborative planning **before** implementation
- Switch from Agent → Plan when the task is large or ambiguous
- Model creates a checklist → you refine together → then execute

### Ask Mode
- Read-only exploration and Q&A—**no changes to your code**
- Great for understanding unfamiliar codebases or getting explanations

---

## Critical Concept: Context Window (5 min)

**What it is**: The model's "short-term memory"—managed by Cursor

**Why it matters**: 
- Models have NO native short-term memory
- Cursor sends relevant history with each prompt
- As context grows → accuracy degrades (show the graph mental model)

**Best practice**: 
> **Start a new chat session (+ button) every time you shift focus**

**Check your usage**: Hover over the wheel icon in the input box

---

## Model Agnosticism (3 min)
- **We support ALL leading models**: Anthropic, OpenAI, Google, xAI, open-source
- **Why this matters**:
  - We tune system prompts per model for best output
  - We roll out new models same-day (often within minutes)
  - Enterprise admins can restrict which models are available
- **Composer 1**: Our own model—purpose-built for code, incredibly fast
  - "It's like crack—once you use it, other models feel slow"
  - Composer 2 coming soon (targeting Claude 4.5 Opus level)

---

## Context & Knowledge

### @ Mentions
- `@file` / `@folder` — attach specific code files or directories
- `@docs` — attach indexed documentation (Settings → Indexing & Docs → Add Doc)
- `@url` — pull in content from a URL
- `@symbols` — reference specific functions, classes, or variables
- `@git` — reference git history, diffs, commits
- `@browser` — control the integrated browser

**Pro tip**: Attaching specific files feels more precise and saves search time

### .cursor/rules
- Project-level instructions that shape AI behavior
- Define coding standards, conventions, architecture decisions
- Commit to the repo so the **whole team** gets consistent AI behavior
- Always-applied rules vs file-pattern-specific rules

### Skills (SKILL.md)
- Reusable, composable workflows the agent can follow
- Think of them as "recipes" the agent reads and executes step-by-step
- Can be project-level or user-level

### MCP (Model Context Protocol)
- Connect external tools directly into the agent's workflow
- Examples: Notion, Figma, Linear, Slack, Sentry, Datadog, databases
- Agent can read from and write to these tools mid-task

### Notepads
- Reusable context snippets you can `@` reference across chats
- Great for storing architecture decisions, API patterns, or team conventions

### .cursoreignore
- Control what the AI can and can't see in your codebase
- Works like `.gitignore`—exclude sensitive files, large generated files, etc.

### Codebase Indexing (Differentiator!)
- Cursor indexes your **entire codebase** automatically
- All tools (Tab, Inline Edit, Chat) are connected to the index
- **Stored as vector embeddings** (just 1s and 0s—we can't read your code)
- **Extremely fast** search even in massive codebases (100k+ files)

**Talk track**: "This is one of our biggest differentiators vs competitors"

---

## Background & Autonomous Agents

### Background Agents (Cloud)
- Spin up agents that work on tasks **in the cloud, asynchronously**, on their own branch
- You keep working while the agent handles a separate task
- Great for parallelizing work across multiple features or bugs

### Multi-Agent Parallelism
- Launch multiple sub-agents to explore or work on different parts of a codebase simultaneously
- Agent can delegate: fast model for simple searches, powerful model for complex reasoning

---

## Code Quality & Review

### BugBot
- Automated AI code review on pull requests
- Catches bugs, security issues, style problems before human review

### Lint Integration
- Agent reads and fixes linter errors after making changes
- Keeps code clean without manual intervention

---

## Model Selection

### Model Picker
- Choose between different models (Claude, GPT, Gemini, etc.) per chat or globally
- **Composer 1**: Cursor's own model—purpose-built for code, incredibly fast

### Model Routing
- Sub-agents can use different models for different tasks
- Fast model for simple searches, powerful model for complex reasoning
- Enterprise admins can restrict which models are available

---

## Workflow Integrations

### Git Integration
- Agent can commit, create branches, open PRs via `gh`
- Full git workflow without leaving the IDE

### MCP Servers
| Server | Use Case |
|--------|----------|
| **Figma** | Design-to-code: turn Figma designs into working components |
| **Linear** | Issue tracking: read/update tickets from chat |
| **Notion** | Docs & tasks: query databases, create pages |
| **Sentry** | Error monitoring: investigate production errors |
| **Slack** | Messaging: read/send messages |
| **Datadog** | Observability: query metrics and logs |
| **Databricks** | Data: run SQL queries, manage pipelines |

### Browser Automation
- Agent can navigate, click, fill forms, screenshot, and test web apps in a real browser
- **Two ways to use**:
  1. **Run button** (triangle icon): Just opens the page
  2. **`@browser` in chat**: Agent controls the browser
- **Demo**: "Test the contact us form using @browser"

---

## Customization & Team

### Team-Shared Rules
- Commit `.cursor/rules` to the repo so the whole team gets consistent AI behavior
- Enforce coding standards, security practices, architecture patterns

### Privacy Mode
- Control what data leaves your machine
- Enterprise-grade data handling

### API Key Configuration
- Bring your own API keys for any supported model provider

---

## Troubleshooting Tips (Keep in Back Pocket)

| Issue | Fix |
|-------|-----|
| Browser won't load | Check Settings → Network → Disable proxy |
| Indexer not active | Usually a proxy issue—same fix |
| Need to bypass local restrictions | Try Cloud Agent (Agent Type dropdown) |
| Chrome vs Browser Tab | Settings → Tools & MCP → Browser Automation |

---

## Wrap-Up Talking Points
- **Non-deterministic nature**: Same prompt can give different results—be on your toes in demos, but it's also a teaching opportunity
- **Start simple**: Tab → Inline Edit → Chat Pane is the typical adoption journey
- **Lean on Field Engineering**: We're here to help—don't hesitate to bring us in

---

## Key Differentiators to Remember
1. **Tab/Fusion model** — fastest, smartest autocomplete in the space
2. **Codebase indexing** — best-in-class understanding of large codebases
3. **Model agnostic** — all leading models, tuned system prompts, same-day releases
4. **Composer 1** — our own model, purpose-built for code, blazing fast
5. **IDE-first approach** — full control over UX, not just a plugin
6. **MCP ecosystem** — deep integrations with Figma, Linear, Notion, Sentry, Slack, and more
7. **Background agents** — async cloud agents that work on their own branch while you keep coding
8. **Rules & Skills** — team-shareable AI behavior customization that lives in the repo
