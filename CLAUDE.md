# CLAUDE.md — Project Configuration for Claude Code

## Project Identity
- **Gamertag / Repo Owner:** tmank5
- **Organization:** AIML-1870-2026
- **Live Base URL:** https://aiml-1870-2026.github.io/tmank5/

---

## Repository Rules

### Branch Strategy
- **All changes go to `dev` — never push directly to `main`.**
- `main` is the stable/production branch and is protected.
- `dev` is the working branch. Always confirm you're on `dev` before making commits.
- If `dev` doesn't exist locally, check it out: `git checkout -b dev origin/dev`

### Before Any Commit
1. Run `git status` to review what's changed.
2. Run `git diff` to sanity-check edits before staging.
3. Never stage unintended files — be deliberate with `git add`.

### Commit Messages
Use clear, descriptive messages in this format:
```
[Type]: Brief description of what changed

Types: Add | Fix | Update | Refactor | Remove | Docs
```
Examples:
- `Add: Julia Set Explorer starter scaffold`
- `Fix: broken canvas render on mobile viewport`
- `Update: particle system performance tuning`

---

## Commands

### Deploy (push to dev)
When I say **"Deploy"**:

1. **Verify branch** — confirm we're on `dev`, not `main`:
   ```bash
   git branch --show-current
   ```
   If not on `dev`, switch: `git checkout dev`

2. **Verify location** — confirm `.git` exists at the repo root.

3. **Stage and commit:**
   ```bash
   git add .
   git commit -m "[Type]: describe what changed"
   ```

4. **Push to dev:**
   ```bash
   git push origin dev
   ```

5. **Report success** — confirm the push and remind me the changes are on `dev`, not yet live.

---

### Start a New Assignment
When I say **"Start [AssignmentName]"**:

1. Make sure we're on `dev`.
2. Create a folder: `[AssignmentName]/`
3. Create a starter `index.html` inside it (minimal, valid HTML5 boilerplate).
4. Confirm the folder is ready and remind me to Deploy when I'm done.

---

### Show My URLs
When I say **"Show my URLs"** or **"Where's my stuff?"**:

1. List all subfolders containing an `index.html`.
2. For each, show the live URL:
   ```
   https://aiml-1870-2026.github.io/tmank5/[AssignmentName]/
   ```

---

### Merge to Main
When I say **"Merge to main"** or **"Go live"**:

1. Confirm I actually want to promote `dev` → `main`.
2. Switch to main, merge, and push:
   ```bash
   git checkout main
   git merge dev
   git push origin main
   git checkout dev
   ```
3. Return to `dev` immediately after — all future work continues there.
4. Confirm the live URL is updated: `https://aiml-1870-2026.github.io/tmank5/`

---

## Coding Standards

- **Single-file preferred:** Keep projects self-contained in `index.html` unless complexity requires splitting.
- **No PII:** No real names, emails, or identifying info in code or comments.
- **Asset naming:** lowercase, hyphen-separated (e.g., `particle-system.js`, `bg-gradient.png`).
- **Folder naming:** Descriptive names strongly preferred (e.g., `Julia-Set-Explorer`, not `assignment3`).
- **Valid HTML5:** Always use `<!DOCTYPE html>` and a proper `<meta charset="UTF-8">`.
- **No dead code:** Don't leave commented-out blocks of old logic — remove it or track it in git history.

---

## What Claude Should Never Do
- Push to `main` without explicit instruction.
- Run `git push --force` without asking first.
- Commit API keys, secrets, or tokens.
- Assume a folder is the repo root — always verify `.git` is present.
- Create nested git repos (no `git init` inside subfolders).
