# Cursor 101 Presentation Cheat Sheet for Sales Engineers

## Opening (3-5 min)
- **Reassure the audience**: You do not need to be an engineer to understand the product surfaces.
- **Field Engineering support**: FEs are here to help. Pull us into customer calls anytime. Slack: `#team-field-eng`.
- **POC structure reminder**: 4-week trial -> Cursor 101 (week 1) -> Cursor 201 (week 2) -> office hours / reverse demos (weeks 3-4).
- **Session framing**: "Cursor is one platform with three surfaces. We will start at the lowest abstraction and work upward: CLI -> IDE -> Cloud."

---

## Session Flow
1. Three surfaces, one platform
2. CLI: the foundation
3. IDE: the core product
4. Cloud: the highest abstraction
5. Choosing the right surface
6. Why this matters in enterprise
7. Key takeaways and Q&A

---

## Three Surfaces, One Platform (2-3 min)
- **Core message**: Cursor is not three disconnected products. It is one platform exposed through different surfaces.
- **CLI**: Lowest abstraction. Most portable. Best for automation and power users.
- **IDE**: Core product. Same platform plus visual feedback, discoverability, and guardrails.
- **Cloud**: Highest abstraction. Agents run remotely so the user does not need local setup.
- **Talk track**: "We will start at the bottom and build up. Each layer makes the platform easier to use for a broader audience."

---

## CLI: The Portable Primitive (5 min)

### What It Is
- Terminal-first Cursor access through `agent` and shell commands.
- The most portable surface because every machine and server already has a terminal.

### Who Uses It
- Power users
- Multi-repo engineers
- CI/CD and automation owners
- People who prefer text-first workflows

### When To Use It
- Headless servers
- Automation and scripting
- Multi-repo work
- Lightweight or low-memory environments

### Products To Mention
- Cursor CLI
- Terminal `Cmd+K`
- Slash commands like `/model`

### Main Talk Track
- If it works in the CLI, it can usually be automated and run on a server.
- This is why the CLI is a building block, not a side feature.
- Claude Code is a useful comparison because it is CLI-first.
- Many customers still do not realize Cursor has a strong CLI surface.

### Optional Demo Hooks
- `agent` in a terminal
- Terminal `Cmd+K` turning plain English into a shell command
- `/model` as the text-first version of a model picker

---

## IDE: Cursor's Core Product (7-8 min)

### What It Is
- A fork of VS Code with files, editor, chat, browser, and terminal working together.
- This is where most engineers will spend their time.

### Who Uses It
- Most engineers
- Anyone who wants visual feedback, diffs, previews, and safer defaults

### When To Use It
- Daily development
- Debugging
- Browser preview
- Design-to-code and general multi-file work

### Products To Mention
- Tab / Fusion
- Inline Edit (`Cmd+K`)
- Chat / Agent (`Cmd+L`)
- Ask / Plan / Agent modes
- Rules, Skills, and MCPs
- Browser, Marketplace, and Glass

### Main Talk Track
- The IDE is the CLI with visual chrome and discoverability layered on top.
- In the CLI, you type `/model`. In the IDE, you pick from a dropdown. Same capability, different experience.
- This is why the IDE is still the core product and usually the easiest place to start.

### Four Quadrants To Call Out
1. Left: file explorer
2. Center: editor
3. Right: chat pane
4. Bottom: terminal / utilities

### Good Demo Anchors If Needed
- Tab autocomplete
- Inline Edit
- Multi-file Agent task
- MCP-assisted workflow

---

## Cloud: Agents Without the Laptop (5-6 min)

### What It Is
- Remote agents triggered from the web, Slack, or other tools.
- The local machine is no longer the center of gravity.

### Who Uses It
- PMs
- AEs
- Non-engineers
- Enterprise teams that need async work

### When To Use It
- Async feature requests
- Scheduled documentation or maintenance tasks
- Cross-repo work without local setup

### Products To Mention
- Cloud Agents
- Automations
- Self-hosted Cloud Agents
- BugBot

### Main Talk Track
- This is the highest abstraction layer because the work moves off the laptop entirely.
- It opens Cursor up to people who do not want to clone repos or manage local setup.
- Adoption is still early, which also means the upside is large.

### Useful Story Hook
- The AE / internal-tool example: an async request comes in, a cloud agent ships the feature, and multiple teammates benefit without engineering manually doing every step.

---

## Choosing the Right Surface (3-4 min)

| Dimension | CLI | IDE | Cloud |
|-----------|-----|-----|-------|
| **Portability** | Anywhere with a terminal | Local machine | Anywhere with a browser |
| **Best for** | Automation and power users | Daily engineering work | Async and remote execution |
| **Visual feedback** | Lowest | Highest | Medium |
| **Multi-repo work** | Excellent | Good | Excellent |
| **Async / scheduled work** | Scriptable | Human-driven | Native |

### Main Talk Track
- These surfaces are **complementary**, not competing.
- Most teams will use a mix:
  - CLI for automation
  - IDE for day-to-day development
  - Cloud for async execution
- The right question is not "Which one is best?" It is "Which one fits this job?"

---

## Why Surface Diversity Matters in Enterprise (3-4 min)

### Marketplace + Admin Control
- Team-pinned plugins and skills let each persona start with the right guardrails.
- Admins can shape the environment instead of hoping every user memorizes the right prompts.

### Model Controls
- Enterprise admins can restrict which models are available by role.
- This matters when PMs, engineers, and analysts should not all have the same defaults.

### Self-Hosted Cloud Agents
- Critical for security-sensitive customers.
- Lets them adopt cloud-style workflows without moving code outside their infrastructure.

### Competitive Framing
- CLI-only tools are strong for experts.
- It is harder for them to become a broad enterprise control plane with visual governance, plugins, and admin UX.

### Main Talk Track
- Cursor's moat is not one feature.
- It is the combination of multiple surfaces plus enterprise controls.

---

## Key Takeaways (2 min)
1. **CLI is the foundation**: portable, scriptable, and automation-friendly.
2. **IDE is the core product**: where most engineers live and where the UX is easiest to discover.
3. **Cloud is the growth frontier**: async agents expand the audience beyond engineers.
4. **The right surface depends on the job**: most teams will mix all three.
5. **Surface diversity matters more as organizations scale**: it enables governance, persona-based workflows, and enterprise adoption.

---

## Back Pocket Q&A

### If People Ask About Models
- Cursor supports all major frontier models.
- Enterprise admins can restrict which models are available.
- Model choice matters less than workflow fit for this deck.

### If People Ask About Context
- Cursor manages the model's short-term working context.
- Best practice: start a new chat when you switch tasks.

### If People Ask About Rules / Skills / MCPs
- **Rules** shape project-level AI behavior.
- **Skills** are reusable workflows / recipes.
- **MCPs** connect outside systems like Figma, Linear, Notion, Slack, Sentry, Datadog, and databases.

### If People Ask About Browser or Git Workflows
- Agent can use a real browser for testing and screenshots.
- Agent can also handle git steps like commits and PR creation.

### If People Ask About Troubleshooting
| Issue | Fix |
|-------|-----|
| Browser will not load | Check Settings -> Network -> Disable proxy |
| Indexer is not active | Usually the same proxy issue |
| Local environment is blocked | Try the Cloud surface instead |

---

## Close
- Re-emphasize: Cursor meets users at different layers of abstraction.
- Start with the surface that feels natural for the user.
- Lean on Field Engineering for demos, setup help, and follow-up technical questions.
