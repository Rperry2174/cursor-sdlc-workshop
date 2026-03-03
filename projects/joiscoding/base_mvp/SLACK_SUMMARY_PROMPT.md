# Slack Morning Summarizer -- Prompt Template

> Copy-paste this prompt into Cursor chat each morning, or reference this file with `@base_mvp/SLACK_SUMMARY_PROMPT.md`.

---

## The Prompt

```
Summarize my Slack for this morning. Follow these steps:

1. Read `projects/joiscoding/base_mvp/config.json` for my channel list and lookback window.

2. Authenticate the Slack MCP if not already connected:
   - Try `plugin-slack-slack` first, fall back to `dashboard-team-1-Slack`.

3. List my Slack channels using the Slack MCP tools.

4. For each channel in my config (or all channels if config says "all"):
   - Fetch recent message history within the lookback window (default: last 24 hours).
   - Skip channels with no new activity.

5. Produce a summary in this format:

   ## Slack Summary — [Today's Date]

   ### Highlights
   - Top 3-5 most important items across all channels

   ### By Channel
   **#channel-name**
   - Bullet point summaries of key messages/threads
   - Action items tagged with [ACTION] if someone needs to do something

   ### Action Items
   - Consolidated list of anything that needs your attention

6. Save the summary to `projects/joiscoding/base_mvp/summaries/YYYY-MM-DD.md`
   (create the file with today's date).

7. Display the summary here in chat as well.
```

---

## Quick Version (one-liner)

```
Read @projects/joiscoding/base_mvp/config.json, connect to Slack via MCP, fetch the last 24 hours of messages from my configured channels, and give me a morning summary. Save it to the summaries/ folder.
```
