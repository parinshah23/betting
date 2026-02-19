---
name: block-git-commit
enabled: true
event: bash
pattern: git\s+commit
action: block
---

🚫 **Blocked: git commit**

You tried to run `git commit` autonomously. This user explicitly manages their own git workflow.

**Instead, provide the command as text for the user to run:**

```
git add <files>
git commit -m "your message"
```

Do not execute git commit yourself — give the user the command to run.
