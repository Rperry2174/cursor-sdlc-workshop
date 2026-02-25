# Weekly trial alerts via Slack

## In the app (ready now)

- **Weekly trial update** panel in the sidebar builds a Slack-ready message: who’s at 1w, 2w, and 3w and which owner to notify.
- Use **Copy to clipboard** and paste into any Slack channel.
- Set a **Slack reminder** (e.g. every Monday): “Post the weekly trial update” and paste the text from the app.

## Using the Slack MCP (when connected)

The Slack MCP in this workspace (**dashboard-team-1-Slack**) can post messages for you, but it **requires authentication** in Cursor.

### 1. Connect the Slack MCP

- Open **Cursor Settings → MCP** and check the status of **dashboard-team-1-Slack**.
- If it says authentication needed, complete the steps (e.g. Slack OAuth or app token) as described in the MCP setup.

### 2. Send the weekly update from Cursor

Once the Slack MCP is connected, you can say in Cursor:

- *“Send the weekly trial update to #trials”*
- *“Post this week’s trial follow-up summary to #sales”*

The agent will use the same logic as the app (contacts at 1w/2w/3w and their owners) to build the message and call the Slack MCP to post it to the channel you name.

### 3. Weekly schedule

- **Option A:** Set a **Slack scheduled message** (if your plan supports it) to post at a fixed time; you’d still need to paste the message or run the app each week.
- **Option B:** Set a **personal reminder** (e.g. every Monday) to open the Trial Follow-up Tracker, copy the “Weekly trial update” message, and paste it into your channel (or ask Cursor to send it via the Slack MCP if connected).

The app does not run in the background; opening it and copying (or asking Cursor to send) is what triggers the “weekly” update.
