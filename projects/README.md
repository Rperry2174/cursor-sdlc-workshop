# Projects

Welcome to the SDLC Workshop!

## How It Works

Each participant creates their own project folder named after their **GitHub username**. Your project and all its code live inside that folder.

### Getting Started

1. **Tell Cursor** to fork the workshop repo, clone your fork, and create a branch
2. **Tell Cursor** to find your GitHub username: `gh api user --jq .login`
3. **Tell Cursor** to copy `project_template/` into a new folder named after your GitHub username
4. **Tell Cursor** to help fill out the PRD in your project folder
5. **Tell Cursor** to commit, push, and open a PR to the original repo

### Example

If your GitHub username is `asmith`, your folder would be:

```
projects/asmith/
├── prd.md                       # Your project spec
├── base_mvp/                    # Your project code goes here
│   └── (your app files)
└── github_command_cheatsheet.md # Git commands reference
```

---

## Folder Structure

```
projects/
├── README.md                    # This file
├── project_template/            # Copy this to get started
│   ├── prd.md
│   ├── base_mvp/
│   │   └── README.md
│   └── github_command_cheatsheet.md
├── asmith/                      # Alice's project
│   ├── prd.md
│   └── base_mvp/
├── bjones/                      # Bob's project
│   ├── prd.md
│   └── base_mvp/
└── ...
```

## What's in the Template

- **`prd.md`** — Instructions and template for your project specification. Fill this in!
- **`github_command_cheatsheet.md`** — Quick reference for all the git commands you'll need
- **`base_mvp/`** — Put your actual project code here
