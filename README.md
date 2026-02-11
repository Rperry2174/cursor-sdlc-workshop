# Cursor SDLC Workshop

> Experience the Software Development Lifecycle Firsthand

A hands-on workshop designed for Cursor's GTM team (AEs, Field Engineering, ADMs) to understand the Software Development Lifecycle by actually living it—not just learning about it.

---

## Purpose

This workshop exists to solve a critical enablement gap: **GTM teams often explain developer workflows without ever having experienced them.**

By the end of this workshop, participants will:

1. **Understand customer pain points firsthand** — not from a slide deck, but from direct experience
2. **Contextualize Cursor's products within the SDLC** — know exactly where Plan Mode, BugBot, Hooks, Skills, and Agents fit
3. **Leave with authentic stories to tell** — real struggles that translate into compelling customer conversations

### Why This Matters

> "AEs are less technical than most Cursor customers—that's the point."

When less technical team members struggle with git, debugging, or code review, they surface friction that experienced developers take for granted. These insights are valuable for:

- Identifying onboarding pain points
- Understanding where Cursor adds the most value
- Speaking authentically about developer challenges

---

## Workshop Structure

| Section | Name | Duration | Team Size | Focus |
|:--------|:-----|:---------|:----------|:------|
| 0 | Pre-Work Setup | 10 min | Individual | Install Cursor, CLI, brew, git |
| 1 | Greenfield Project | 45 min | 5 people | Build from scratch through full SDLC |
| 2 | Legacy Codebase | 30 min | 5 people | Add features using BugBot, Hooks, Skills, Agents |
| 3 | Real-World Chaos | 35 min | 20+ people | CursorFlix Clash — Netflix clone competition |
| — | Closing | 10 min | All | Connect experience to customer conversations |

**Total Duration:** ~2 hours

---

## The SDLC Journey

Participants experience every stage of the Software Development Lifecycle:

```
Plan  →  Design  →  Develop  →  Test  →  Review  →  Deploy
```

### Cursor Features by SDLC Stage

| Stage | What Happens | Cursor Feature |
|:------|:-------------|:---------------|
| **Plan** | Define requirements, break down tasks | Plan Mode, multi-model reasoning |
| **Design** | Architecture decisions, structure | Context-aware suggestions |
| **Develop** | Write code, implement features | Tab completion, Cmd+K, Agent mode |
| **Test** | Validate functionality | Test generation, bug detection |
| **Review** | Code review, quality checks | BugBot, PR analysis |
| **Deploy** | Ship to production | CI/CD assistance |

---

## The Git Sandwich (Agent-First)

A core teaching of this workshop is the **Git Sandwich** pattern—the idea that all productive work is wrapped in git operations. But participants don't need to memorize commands. **They tell the Cursor agent what they want.**

Since participants aren't collaborators on the workshop repo, they fork it first (the agent handles this).

### Fork Setup (One Time)
```
┌─────────────────────────────────────────────────────────┐
│  Ask Cursor:                                            │
│  "Fork this repo [URL], clone my fork,                  │
│   and create a branch called [team]/setup"              │
└─────────────────────────────────────────────────────────┘
```

### The Git Sandwich (Every Task)

```
┌─────────────────────────────────────────────────────────┐
│  START — Ask Cursor:                                    │
│  "Sync my fork with upstream, pull the latest,          │
│   and create a branch called [name]"                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  WORK                                                   │
│  (Tell Cursor what to build — this is the fun part)     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  FINISH — Ask Cursor:                                   │
│  "Commit my changes with message '[description]',       │
│   push to my fork, and open a PR to the original repo"  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  SYNC — Ask Cursor:                                     │
│  "Sync my fork with upstream and pull the latest"       │
└─────────────────────────────────────────────────────────┘
```

This pattern is reinforced throughout the workshop slides.

---

## Repository Contents

```
cursor-sdlc-workshop/
├── README.md                        # This file
├── slides/
│   └── cursor-sdlc-slides.html      # Interactive HTML slide deck
├── docs/
│   └── cursor-sdlc-workshop.docx    # Comprehensive facilitator guide
├── startup-stress-test/             # Example app: Startup Idea Stress Tester
│   └── src/
│       ├── App.jsx                  # Main app with form/results toggle
│       ├── components/              # Scorecard, RadarChart, ReportSummary
│       └── data/                    # Scoring engine and industry data
└── teams/                           # Created during workshop
    └── [team-name]/
        ├── members/
        │   └── [name].md
        └── prd.md
```

### Slides

`cursor-sdlc-slides.html` — An interactive HTML/CSS slide deck with:
- Arrow key navigation (← →) or spacebar
- Progress bar
- Color-coded sections
- Visual "Git Sandwich" diagrams
- Checklists with code blocks

*To present:* Open in any modern browser. Works offline.

### Facilitator Guide

`cursor-sdlc-workshop.docx` — A detailed document containing:
- Executive summary and purpose
- Audience breakdown and roles
- Section-by-section instructions
- SDLC-to-Cursor feature mapping
- Closing discussion guide

### Startup Stress Tester

`startup-stress-test/` — A React app demonstrating what can be built with Cursor:
- **Input form** for startup metrics (TAM, competition, feasibility, risks, etc.)
- **Scorecard** with letter grades (A-F) for each dimension
- **Radar chart** (pure SVG) visualizing strengths and weaknesses
- **Report summary** with verdict, risk flags, and recommendations

*To run:* `cd startup-stress-test && npm install && npm run dev`

---

## Section Details

### Section 0: Pre-Work Setup
*10 minutes · Individual*

Participants install their development environment:
- Download & install Cursor
- Install Cursor CLI (`agent` command)
- Use Cursor to install brew and git
- Verify installations

**Key insight:** Using AI to solve setup problems from the very first step.

---

### Section 1: Greenfield Project
*45 minutes · Teams of 5*

Teams build a simple application from scratch.

**Phase 1 — Plan** (10 min)
- Fork repo, clone your fork, create team folder
- Write PRD with MVP + 5 tasks (one per person)
- Practice full git workflow: fork → branch → work → PR → merge

**Phase 2 — Design** (10 min)
- ONE person creates base MVP
- Team watches and agrees on approach
- Merge foundation for everyone to build on

**Phase 3 — Develop** (20 min)
- EACH person implements their assigned task
- Use Plan Mode to architect their section
- Create individual branches and PRs

**Phase 4 — Test** (5 min)
- Merge all PRs
- Run complete application
- Fix integration issues together

**Key insight:** Cursor assists at every stage of the SDLC, not just code writing.

---

### Section 2: Legacy Codebase
*30 minutes · Teams of 5*

Teams receive another team's project and must navigate unfamiliar code.

**Step 1 — Enable Advanced Features** (10 min)
- Turn on BugBot (using docs)
- Add a Hook
- Add a Skill
- Add an Agent

> Participants jot down onboarding feedback for the eng team.

**Step 2 — Understand the Code** (5 min)
- Use Ask Mode to explore unfamiliar codebase
- Figure out how to run the project

**Step 3 — Add a Feature** (10 min)
- Implement a small visible feature
- Watch BugBot review the PR

**Key insight:** Advanced Cursor features make unfamiliar code dramatically easier.

---

### Section 3: Real-World Chaos
*35 minutes · 4 teams of 20+*

**CursorFlix Clash** — Teams compete to transform an ugly movie website into a Netflix clone.

**The Rules:**
1. No PR over 500 lines (auto-rejected)
2. Everyone must contribute 1+ merged PR
3. Live deploy to big screen

**Transformation:**

| Before | After |
|:-------|:------|
| Times New Roman | Netflix dark theme |
| HTML table with `border="1"` | Card grid with hover |
| Gray "[no image]" boxes | Real movie posters |
| "Here are some movies" | Hero, search, My List |

**Key insight:** SDLC discipline scales. Teams that plan and coordinate outperform those that don't.

---

## Key Takeaways

By workshop end, participants can:

1. **Speak authentically** about SDLC pain points because they experienced them
2. **Know where Cursor features fit** in the development workflow
3. **Tell the before/after story** that resonates with customers
4. **Explain why process matters at scale** to engineering leaders

### The Story to Tell

> "Cursor isn't just a code editor—it's an engineering force multiplier across the entire SDLC."
>
> From planning to deployment. From greenfield to legacy. From small teams to enterprise scale.

---

## For Facilitators

### Before the Workshop

- [ ] Ensure all participants have Cursor downloaded
- [ ] Set up the workshop repository
- [ ] Prepare reviewer assignments (FE, Ryan P, Ryan S)
- [ ] Test CursorFlix starter app deployment
- [ ] Set up big screen for Section 3

### During the Workshop

- Circulate during Section 1 to help with git confusion
- Watch for "aha moments" when people compare GitHub vs local folders
- Collect onboarding feedback from Section 2
- Keep energy high during Section 3 competition

### After the Workshop

- Compile onboarding feedback for eng team
- Share photos/screenshots of CursorFlix transformations
- Follow up with participants on customer conversation applications

---

## Success Metrics

- All participants complete at least one merged PR
- Teams successfully deploy working applications
- Participants can articulate where each Cursor feature fits in SDLC
- Onboarding feedback collected and delivered to eng team

---

## Contributing

Found an issue or have an improvement?

- Open an issue describing the problem
- Submit a PR with your fix
- Request review from workshop maintainers

---

## License

Internal Cursor use only. Not for external distribution.

---

<p align="center">
  <em>Now go tell the story.</em>
</p>
