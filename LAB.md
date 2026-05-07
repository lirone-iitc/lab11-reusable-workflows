# Lab 11: Reusable Workflows

## Goal

Wire a caller workflow to a pre-built reusable workflow. Observe how **inputs**, **secrets**, and **outputs** cross the `workflow_call` boundary.

You edit one file: `.github/workflows/deploy.yml`. Everything else is provided.

---

## What You Have

| File | Status | Description |
|------|--------|-------------|
| `.github/workflows/reusable-deploy.yml` | ✅ Complete | The reusable workflow — read it, don't edit it |
| `.github/workflows/deploy.yml` | ❌ Incomplete | Your task: fill in the 3 TODO lines |
| `src/release.js` | ✅ Complete | `formatRelease(version, env)` helper |
| `scripts/build.js` | ✅ Complete | Writes `dist/release-notes.txt` |
| `test/release.test.js` | ✅ Complete | 3 Jest tests |

---

## Steps

### 1. Run the tests locally

```bash
npm install
npm test
```

All 3 tests should pass. No secrets or environment variables needed.

### 2. Push the repo to GitHub

```bash
git add .
git commit -m "start lab 11"
git push
```

### 3. Add the repository secret

In your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**

- Name: `DEPLOY_TOKEN`
- Value: `fake-token-lab11`

### 4. Complete `deploy.yml`

Open `.github/workflows/deploy.yml`. Fill in the three TODO lines:

**TODO 1** — call the reusable workflow:
```yaml
uses: ./.github/workflows/reusable-deploy.yml
```

**TODO 2** — pass the environment input:
```yaml
environment: staging
```

**TODO 3** — pass the secret:
```yaml
deploy-token: ${{ secrets.DEPLOY_TOKEN }}
```

Then commit and push:
```bash
git add .github/workflows/deploy.yml
git commit -m "complete deploy workflow"
git push
```

### 5. Watch the run

Go to **Actions** in your GitHub repo. You should see:

- A `Deploy to staging` job (spawned by the reusable workflow) running checkout → install → test → build → fake deploy
- A `Confirm deployment` job printing a line that starts with `[STAGING] Deploying v`

---

## Acceptance Criteria

- [ ] `deploy.yml` triggers on push to `main`
- [ ] The `call-deploy` job calls `.github/workflows/reusable-deploy.yml` with `environment: staging`
- [ ] The `deploy-token` secret is passed via `${{ secrets.DEPLOY_TOKEN }}`
- [ ] All steps in the reusable workflow pass (checkout, install, test, build, fake deploy)
- [ ] The `confirm` job prints a line starting with `[STAGING] Deploying v` in the Actions logs

---

## Hints

- The `uses:` key on a **job** (not a step) is what makes it a caller. It replaces `runs-on:` — do not use both on the same job.
- `with:` passes inputs, `secrets:` passes secrets. Both are siblings of `uses:` on the job, not under `steps:`.
- You cannot mix `uses:` and `steps:` on the same job — that's why `confirm` is a separate job with `needs: call-deploy`.
- If `confirm` prints `Deploy result:` with nothing after the colon, the `needs:` reference in that job is looking for the wrong job ID — check that `call-deploy` matches exactly.

---

## Key Concepts

### The `workflow_call` trigger

A reusable workflow uses `workflow_call` instead of `push` or `pull_request`. It **never runs on its own** — it only runs when called by another workflow via `uses:`.

### Inputs vs Secrets

| | Inputs | Secrets |
|---|--------|---------|
| Default values | ✅ Allowed | ❌ Not allowed |
| Visible in logs | ✅ Yes | ❌ Masked |
| Types | string, boolean, number, choice | (always string) |

### The two-hop output chain

Outputs from a reusable workflow travel three levels:

```
step output  →  job output  →  workflow_call output
$GITHUB_OUTPUT   outputs:        on.workflow_call.outputs:
```

This is why `reusable-deploy.yml` defines `outputs:` in two places. Both hops are required.

### Accessing outputs in the caller

After the reusable workflow runs, its outputs are available as:

```yaml
${{ needs.<job-id>.outputs.<output-name> }}
```

Where `<job-id>` is the job in the **caller** workflow that used `uses:` (here: `call-deploy`).
