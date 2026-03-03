# Slack Morning Summarizer

An MCP-powered flow that connects to your Slack workspace, reads recent channel activity, and gives you a concise morning digest -- all from within Cursor.

## How It Works

This is **not** a traditional app. It's an agent-driven flow:

1. You open Cursor and paste a prompt (or reference the prompt file).
2. The Cursor agent authenticates with Slack via the Slack MCP server.
3. It lists your channels, fetches recent messages, and produces a summary.
4. The summary is displayed in chat and saved to `summaries/YYYY-MM-DD.md`.

## Setup (one-time)

1. Make sure the **Slack MCP server** is enabled in your Cursor settings.
2. The first time you run the summarizer, it will trigger Slack authentication in your browser. Approve the connection.
3. Edit `config.json` to customize which channels to include and how far back to look.

## Daily Usage

**Option A -- Reference the prompt file:**
```
@projects/joiscoding/base_mvp/SLACK_SUMMARY_PROMPT.md -- run this
```

**Option B -- Quick one-liner:**
```
Read @projects/joiscoding/base_mvp/config.json, connect to Slack via MCP,
fetch the last 24 hours of messages from my configured channels,
and give me a morning summary. Save it to the summaries/ folder.
```

## Configuration

Edit `config.json` to control the summarizer:

| Field | Default | Description |
|---|---|---|
| `slack_mcp_server` | `plugin-slack-slack` | Primary MCP server to use |
| `fallback_mcp_server` | `dashboard-team-1-Slack` | Fallback if primary fails |
| `channels` | `"all"` | `"all"` or an array like `["general", "eng"]` |
| `exclude_channels` | `["social-random", "random"]` | Channels to skip when using `"all"` |
| `lookback_hours` | `24` | How many hours back to fetch messages |
| `save_summaries` | `true` | Whether to save summaries to disk |

## Project Structure

```
base_mvp/
  README.md                    -- You are here
  SLACK_SUMMARY_PROMPT.md      -- The prompt template to run each morning
  config.json                  -- Channel list and settings
  summaries/                   -- Saved daily summaries (YYYY-MM-DD.md)
```
