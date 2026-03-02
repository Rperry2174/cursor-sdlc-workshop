# Git Cheatsheet

Everything in this workshop can be done by **telling the Cursor agent what you want**. You don't need to memorize commands — just describe what you need in plain English.

The raw git commands are included below as a reference so you can see what the agent is doing under the hood.

---

## 🚀 Tell Cursor What You Need

### Getting Started (Fork + Clone)
> **Ask Cursor:** "Fork this repo https://github.com/Rperry2174/cursor-sdlc-workshop and clone my fork"

This tells the agent to:
1. Create your own copy (fork) of the workshop repo
2. Download it to your computer

### Syncing (Before Starting New Work)
> **Ask Cursor:** "Sync my fork with upstream and pull the latest changes"

This tells the agent to:
1. Get the latest updates from the original repo into your fork
2. Download them to your computer

### Saving & Sharing Your Work
> **Ask Cursor:** "Commit all my changes with the message '[description]', push to my fork, and open a PR to the original repo"

This tells the agent to:
1. Package up your changes with a description
2. Upload them to your fork on GitHub
3. Open a Pull Request (proposal to add your changes to the official project)

### Troubleshooting
> **Ask Cursor:** "I'm stuck — [describe the problem]. Can you help me fix it?"

The agent can handle merge conflicts, permission issues, wrong branches — just describe what happened.

---

## 📖 Git Command Reference

The commands below are what the agent runs for you. They're here so you can follow along and learn what's happening.

### Fork & Clone (One Time)
```bash
# The agent does this when you ask it to fork and clone:
gh repo fork https://github.com/Rperry2174/cursor-sdlc-workshop --clone
cd sdlc-workshop
```
**What it does:** Creates your own copy of the repo on GitHub and downloads it.

### Branches
```bash
git checkout -b [branch-name]    # Create a new branch (sandbox)
git checkout [branch-name]       # Switch to an existing branch
git branch                       # See what branch you're on
```

**Branch naming conventions:**
- Setup: `[team]/setup` (e.g., `team_5/setup`)
- Base MVP: `[team]/base-mvp` (e.g., `team_5/base-mvp`)
- Features: `[your-name]/[feature]` (e.g., `alice/dark-mode`)

### Syncing
```bash
# The agent does this when you ask it to sync:
gh repo sync                     # Sync your fork with the original
git pull origin main             # Download synced changes locally
```

### Saving Work
```bash
git add .                        # Stage all changes
git commit -m "Your message"     # Save with a description
git push origin main             # Upload to your fork
```

### Opening a PR
```bash
# The agent does this when you ask it to open a PR:
gh pr create --title "..." --body "..."
```
**What it does:** Opens a Pull Request from your fork to the original repo — proposing your changes be added to the official project.

---

## 🆘 Common Issues

### "I'm on the wrong branch!"
> **Ask Cursor:** "I'm on the wrong branch. Save my changes and move me to [correct-branch]"

### "I have merge conflicts!"
> **Ask Cursor:** "I have merge conflicts. Help me resolve them"

### "git push was rejected"
> **Ask Cursor:** "My push was rejected. Sync my fork and try again"

### "I don't have permission to push"
> **Ask Cursor:** "I'm getting a permission error when pushing. Can you check if I'm pushing to my fork?"

---

## 📋 Quick Reference

| What You Want | Tell Cursor |
|---------------|-------------|
| Get started | "Fork this repo https://github.com/Rperry2174/cursor-sdlc-workshop and clone my fork" |
| Get latest changes | "Sync my fork with upstream and pull the latest" |
| Save your work | "Commit my changes with message '[msg]'" |
| Share your work | "Push to my fork and open a PR to the original repo" |
| Start new task | "Sync my fork with upstream and pull the latest" |
| Fix a problem | "I'm stuck — [describe what happened]" |
