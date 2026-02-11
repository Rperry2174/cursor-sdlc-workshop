# Team Members

Each team member creates their own file in this folder.

## What to Do

> **Ask Cursor:** "Create my member file in this folder. My name is [name] and my role is [AE/FE/ADM]. Help me find my GitHub username too."

Or do it manually:
1. Create a new file named `[your-name].md` (e.g., `alice.md`)
2. Add your info using the template below
3. Let Cursor commit and push for you

> **Don't know your GitHub username?** Ask Cursor! It can run `gh api user --jq .login` to find it for you.

## Template

```markdown
# [Your Name]

**Role:** [AE/FE/ADM]
**GitHub:** [@your-username](https://github.com/your-username)
```

## Example

```markdown
# Alice Smith

**Role:** AE
**GitHub:** [@asmith](https://github.com/asmith)
```

## Example File Structure

When your team is done, this folder should look like:

```
members/
├── README.md
├── alice.md
├── bob.md
├── carlos.md
├── diana.md
└── eve.md
```

Each `.md` file contains that person's info using the template above.

---

## Why This Matters

This is your first git exercise! Tell Cursor to:
1. Create your member file
2. Commit your changes
3. Push to your fork and open a PR to the original repo

If multiple people try to push at the same time... you'll get to experience your first merge conflict. Tell Cursor to help you fix it!
