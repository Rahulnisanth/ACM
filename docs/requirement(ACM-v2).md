# Auto-Commit Mate++ — Enhanced Requirements (v2.0)

> AI-Driven Development Specification for Antigravity
> Version: 2.0 (Enhanced)
> Base: ACM v1.2.0 — VS Code Extension (JavaScript, CommonJS)
> Last Updated: 2026-03-28

---

## 0. V1 Codebase Audit Summary

> This section documents what ACM v1.2.0 **currently does**, grounding v2 planning in reality.

### V1 Tech Stack (Actual)

| Layer       | Technology                                                              |
| ----------- | ----------------------------------------------------------------------- |
| Language    | JavaScript (CommonJS, `require`/`module.exports`)                       |
| Runtime     | Node.js ≥ 18.x (in-process within extension)                            |
| Extension   | VS Code Extension API (`^1.96.0`)                                       |
| Git         | `child_process.execSync` (no external git library)                      |
| HTTP        | `axios` (`^1.7.9`) for GitHub REST API calls                            |
| Auth        | VS Code `globalState` (plain text — **not secret storage**)             |
| Logs        | Local Markdown files inside `Activity-Logger/` folder in each project   |
| Remote Sync | GitHub Contents API (PUT) — pushes `.md` logs to `Activity-Logger` repo |

### V1 Commands (Actual, from `package.json`)

| Command ID                      | Title                                      |
| ------------------------------- | ------------------------------------------ |
| `extension.startAutoCommitting` | Start the Auto-Commit extension            |
| `extension.setTimeDuration`     | Set time duration for auto-committing logs |

### V1 Settings (Actual, from `package.json`)

| Setting Key                     | Type   | Default | Notes                          |
| ------------------------------- | ------ | ------- | ------------------------------ |
| `autoCommitMate.githubUsername` | string | `""`    | Plain text, machine-scoped     |
| `autoCommitMate.githubToken`    | string | `""`    | Plain text — **security risk** |

### V1 Data Flow (Actual)

```
VS Code Startup
  └─► showInformationMessage prompt → "Yes, let's go"
        └─► startAutoCommitting(context)
              ├─► getWorkspacePath()           # uses vscode.workspace.workspaceFolders[0]
              ├─► showTimeDurationSelector()   # QuickPick: 15 / 30 / 45 min
              ├─► git rev-parse (detect git)
              ├─► getRemoteAddress()           # git remote get-url origin
              ├─► createGlobalRepoIfNotExists() # GitHub API: POST /user/repos
              ├─► getHistoryFolderStatus()     # check Activity-Logger/ exists
              └─► startProjectTracking()
                    └─► setInterval(duration * 60 * 1000)
                          └─► createReadmeLogs()
                                ├─► getChanges()            # git diff --stat + --cached --stat
                                ├─► cache.txt deduplication (raw string compare)
                                ├─► formatPRepoLogs()       # Markdown for project repo
                                ├─► formatGRepoLogs()       # Markdown for global repo
                                ├─► commitAndPushToProjectRepo()  # execSync git add/commit/push
                                └─► commitAndPushToGlobalRepo()   # axios PUT GitHub Contents API
```

### V1 Log File Format (Actual)

**Project Repo (`Activity-Logger/[Feb 04, 2025: 5:41 PM to 5:56 PM].md`):**

```markdown
⚠️ Warning: Avoid interacting with the `Activity-Logger/*` folder and `cache.txt` file directly.

# Project Logs

## Date: Feb 04, 2025

## Time: 5:41 PM to 5:56 PM

### Changes:

- src/extension.js | 3 ++-

### Summary:

1 file changed, 2 insertions(+), 1 deletion(-)
```

**Global Repo (`Activity-Logger` GitHub Repo, same filename):**

```markdown
# Logs for the Repository: Rahulnisanth/ACM

## Date: Feb 04, 2025

## Time: 5:41 PM to 5:56 PM

### Changes:

- src/extension.js | 3 ++-

### Summary:

1 file changed, 2 insertions(+), 1 deletion(-)
```

### V1 Known Issues / Gaps (identified from codebase scan)

| #   | Issue                                                                 | Location                                               |
| --- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| 1   | GitHub PAT stored in plain `globalState` — not encrypted              | `src/auth/credentials.js`                              |
| 2   | Only a single workspace folder supported (`workspaceFolders[0]`)      | `src/pkg/common/getWorkspacePath.js`                   |
| 3   | `setInterval` is never cleared — leaks on re-activation               | `src/features/projectTracking/startProjectTracking.js` |
| 4   | Duplicate startup prompt on every VS Code open (no "don't ask again") | `src/extension.js`                                     |
| 5   | Cache deduplication is a raw string compare — brittle                 | `src/features/createLogs/createReadmeLogs.js`          |
| 6   | No idle/active time distinction — any `git diff` diff triggers a log  | `getChanges.js`                                        |
| 7   | `git push` uses `execSync` — blocks extension host thread             | `commitAndPushToProjectRepo.js`                        |
| 8   | Only 3 hardcoded time options (15/30/45 min)                          | `showTimeDurationSelector.js`                          |
| 9   | No status bar indicator — no passive visibility of ACM running        | N/A                                                    |
| 10  | No AI classification of commits or work type detection                | N/A                                                    |
| 11  | Logs are Markdown only — no structured data format                    | N/A                                                    |
| 12  | `auto_init: false` on repo creation may break first-push              | `createGlobalRepoIfNotExists.js`                       |

---

## 1. Project Overview

**Auto-Commit Mate++ (ACM v2)** is a VS Code extension that transforms the existing v1 auto-commit-and-log mechanism into an intelligent, context-aware developer work-log and productivity system.

**What v1 does**: Periodically detects `git diff --stat` changes and pushes Markdown log files to both the current project repo and a centralized `Activity-Logger` GitHub repository, using GitHub PAT authentication.

**What v2 adds on top**:

- Migrate auth to VS Code **Secret Storage** (fix security gap)
- Add a **Status Bar** live indicator
- Add **AI-powered commit classification** via Google Gemini API
- Add **smart commit grouper** into logical work units
- Add **multi-workspace** support
- Add **natural language query** panel ("What did I work on today?")
- Add **report generator** (Daily / Weekly / Appraisal)
- Rewrite in **TypeScript** with proper module structure
- Fix all known v1 issues listed above

**Goal:** Help developers automatically understand, summarize, and communicate what they worked on — without any manual logging effort, building on the solid v1 foundation.

---

## 2. Tech Stack

| Layer           | Technology                                                                   |
| --------------- | ---------------------------------------------------------------------------- |
| Language        | **TypeScript** (migrate from JavaScript CommonJS)                            |
| Extension       | VS Code Extension API (`^1.96.0`)                                            |
| Local Engine    | Node.js ≥ 18.x (in-process within extension)                                 |
| AI / LLM        | Google Gemini API (`gemini-2.0-flash`) via `@google/generative-ai`           |
| Version Control | Git CLI via `child_process.exec` (async, non-blocking)                       |
| Remote Sync     | GitHub REST API v3 via `axios`                                               |
| Auth Storage    | VS Code **Secret Storage** (`context.secrets`) — replaces v1 `globalState`   |
| Local Storage   | Structured JSON files in `~/.acm/` (replaces per-project `Activity-Logger/`) |
| Report Export   | Markdown (built-in), PDF (via `markdown-pdf`), JSON                          |
| Build           | `esbuild` or `tsc` + webpack                                                 |
| Testing         | Jest + VS Code Extension Test Runner (`@vscode/test-cli`)                    |

### Migration Note (v1 → v2)

- v1 uses **CommonJS** (`require`/`module.exports`). v2 migrates to **ES Modules** or **TypeScript** compiled modules.
- v1 stores credentials in `context.globalState`. v2 **must** migrate to `context.secrets` immediately.
- v1 stores logs as Markdown in project repos. v2 stores structured JSON in `~/.acm/` and generates Markdown/PDF reports on demand.
- v1 uses `execSync` blocking calls. v2 uses async `exec` with proper error handling.

---

## 3. Core Modules

### 3.1 Activity Tracker (`src/tracker/`)

**V1 Status:** Partially exists. `startProjectTracking.js` uses `setInterval` + `getChanges()` (`git diff --stat`) to detect changes. Does NOT hook into VS Code document events.

**V2 Requirements (new):**

- Hook into `vscode.workspace.onDidChangeTextDocument` to capture every file edit event
- Record per event: `filePath`, `timestamp`, `linesAdded`, `linesRemoved`, `languageId`, `sessionId`, `repoRoot`
- Hook into `vscode.window.onDidChangeActiveTextEditor` for focus/context switches
- Detect idle time: if no edit event occurs for `>= idleThresholdMinutes` (configurable, default 5), mark a session boundary
- Distinguish **active coding time** vs **idle/reading time**
- Store raw events in rolling JSON log: `~/.acm/logs/YYYY-MM-DD.json`
- Log rotation: keep last `logRetentionDays` days (default 90), archive older entries
- **Fix v1 bug #3**: Store the `setInterval` handle in `context.subscriptions` to ensure cleanup on deactivation

**Data Shape (per event):**

```json
{
  "eventId": "uuid-v4",
  "type": "edit | focus | idle | commit",
  "filePath": "src/auth/credentials.js",
  "repoRoot": "/Users/user/projects/ACM",
  "repoName": "ACM",
  "timestamp": "2026-03-28T10:34:00Z",
  "linesAdded": 5,
  "linesRemoved": 2,
  "languageId": "javascript",
  "sessionId": "uuid-v4"
}
```

---

### 3.2 Git Integration Engine (`src/git/`)

**V1 Status:** Core git utilities exist:

- `getChanges.js` — `git diff --stat` + `git diff --cached --stat`
- `getRemoteAddress.js` — `git remote get-url origin`
- `commitAndPushToProjectRepo.js` — `execSync git add / commit / push`
- All use **blocking** `execSync`

**V2 Requirements:**

- **Migrate all `execSync` to async `exec`** (fix v1 bug #7 — non-blocking)
- On each commit detect: `hash`, `message`, `author`, `timestamp`, `filesChanged`, `diffStat`
- Poll for new commits every 5 minutes via a background interval (store handle in subscriptions)
- Match commit timestamps to activity log sessions
- Detect **uncommitted large change risk**: warn if `>= riskThresholdLines` changed without a commit in the last `riskThresholdMinutes`
- **Fix v1 bug #2**: Support **multiple workspace roots** (iterate `vscode.workspace.workspaceFolders`, not just index 0)

**Git Commands Used:**

```bash
# Reused from v1 (async versions)
git diff --stat
git diff --cached --stat
git remote get-url origin
git rev-parse --is-inside-work-tree

# New in v2
git log --oneline --since="7 days ago" --pretty=format:'%H|%s|%an|%ad' --date=iso
git status --porcelain
```

---

### 3.3 Auth Module (`src/auth/`)

**V1 Status:** `credentials.js` uses `context.globalState` for PAT storage — **plain text, unencrypted** (v1 bug #1).

> ⚠️ **This is the highest-priority fix in v2.**

**V2 Requirements:**

- Store GitHub PAT using `context.secrets.store(key, value)` / `context.secrets.get(key)`
- Migrate existing `globalState` credentials to `secretStorage` on first v2 activation
- Remove `autoCommitMate.githubToken` from `package.json` `contributes.configuration` (never store token in settings)
- Keep `autoCommitMate.githubUsername` in settings (non-sensitive)
- Store Gemini API key in `context.secrets` as well (never in settings plain text)
- Provide a "Clear Credentials" command for easy re-auth

**V1 → V2 Migration:**

```typescript
// On first v2 activation, migrate if old credentials found
const oldToken = context.globalState.get<string>('githubToken');
if (oldToken) {
  await context.secrets.store('acm.githubToken', oldToken);
  await context.globalState.update('githubToken', undefined);
}
```

---

### 3.4 GitHub Sync Engine (`src/sync/`)

**V1 Status:** `commitAndPushToGlobalRepo.js` pushes Markdown logs to `Activity-Logger` repo via GitHub Contents API (PUT) using `axios`. `createGlobalRepoIfNotExists.js` creates the repo if needed.

**V2 Requirements (evolution of v1):**

- Retain the v1 concept of a centralized `Activity-Logger` GitHub repo
- **Fix v1 bug #12**: Set `auto_init: true` when creating the global repo (ensures default branch exists)
- Change push structure from flat Markdown files to organized paths:
  - `logs/YYYY/MM/DD.json` — structured daily log (JSON)
  - `reports/YYYY-MM-DD-daily.md` — generated daily report (Markdown)
  - `reports/YYYY-WW-weekly.md` — generated weekly report
- Retain backward-compatible Markdown push for per-project logs (optional, user-configurable)
- Sync runs silently once per day (default), configurable via `acm.syncFrequencyHours`
- Provide a manual **"Sync Now"** command: `acm.syncNow`
- Show sync status in status bar on manual trigger

---

### 3.5 AI Classification Engine (`src/ai/classifier.ts`)

**V1 Status:** Does not exist.

**V2 Requirements (new):**

- Send commit message + diff summary to Gemini via `@google/generative-ai`
- **Privacy rule (inherit from v1 spirit):** Never send raw source code — only commit messages and `git diff --stat` summaries
- Classify work type into exactly one of:
  - `feature` — new functionality added
  - `bugfix` — correcting a defect
  - `refactor` — code restructuring without behavior change
  - `docs` — documentation changes
  - `test` — test additions or fixes
  - `chore` — config, deps, tooling
  - `unknown` — insufficient signal
- Return a confidence score (`0.0–1.0`) alongside the classification
- Cache results keyed by `commitHash` to avoid redundant API calls (JSON file at `~/.acm/classifier-cache.json`)
- **Graceful degradation**: if the Gemini API is unavailable or key not set, fall back to keyword-based rule matching

**Prompt Template (system):**

```
You are a senior software engineer analyzing Git commits.
Given a commit message and diff summary, classify the work type.
Respond ONLY with valid JSON: { "type": "<type>", "confidence": <float>, "summary": "<1 sentence>" }
Types: feature | bugfix | refactor | docs | test | chore | unknown
```

**Keyword Fallback Rules (for offline/no-key mode):**

| Keyword pattern       | Classification |
| --------------------- | -------------- |
| `fix`, `bug`, `patch` | `bugfix`       |
| `feat`, `add`, `new`  | `feature`      |
| `refactor`, `clean`   | `refactor`     |
| `doc`, `readme`       | `docs`         |
| `test`, `spec`        | `test`         |
| `chore`, `dep`, `ci`  | `chore`        |

---

### 3.6 Smart Commit Grouper (`src/ai/grouper.ts`)

**V1 Status:** Does not exist.

**V2 Requirements (new):**

- Group commits that share: similar file paths, related keywords, or were made within a 4-hour window
- Use Gemini to assign a human-readable task name to each cluster
  - E.g.: 3 commits touching `auth/`, `credentials.js`, `secrets.ts` → `"Secure Auth Migration"`
- Store groups as `WorkUnit` objects: `id`, `name`, `type`, `commits[]`, `startTime`, `endTime`, `repos[]`
- Expose grouped view in VS Code sidebar tree view
- Re-group on demand (manual refresh button) and automatically after each new commit detection

---

### 3.7 Report Generator (`src/reports/`)

**V1 Status:** Does not exist — v1 only generates raw Markdown logs per interval.

**V2 Requirements (new):**

#### 3.7.1 Report Types

| Report           | Scope             | Trigger                                            |
| ---------------- | ----------------- | -------------------------------------------------- |
| Daily Summary    | Last 24 hours     | Manual (`acm.generateDaily`) or end-of-day trigger |
| Weekly Work-Log  | Last 7 days       | Manual (`acm.generateWeekly`)                      |
| Monthly Summary  | Last 30 days      | Manual (`acm.generateMonthly`)                     |
| Appraisal Report | Custom date range | Manual (`acm.generateAppraisal`)                   |

#### 3.7.2 Report Content

Each report must include:

- **Time Summary:** Total active coding hours, breakdown by day
- **Work Units:** Grouped tasks with type labels and commit counts (from Grouper)
- **Repo Breakdown:** Time and commits per repository
- **Top Files:** Most frequently edited files (from activity tracker)
- **Achievement Highlights:** AI-generated 2–3 sentence narrative of the period's work
- **Risk Flags:** Any large uncommitted changes detected during the period

> **V1 Log Data Compatibility:** For users upgrading from v1, the report generator should be able to consume the existing `Activity-Logger/[date: time].md` files as a fallback data source when structured JSON logs are not yet available.

#### 3.7.3 Natural Language Query

- Provide a chat input in the sidebar: _"What did I work on this week?"_
- Send question + summarized work-log context to Gemini
- Return a conversational answer in the sidebar panel
- Support follow-up questions within the same session

#### 3.7.4 Export Formats

- **Markdown** (`.md`) — default, always available
- **PDF** — rendered via `markdown-pdf`; requires optional install
- **JSON** — machine-readable raw export for integrations

---

### 3.8 Multi-Repository Manager (`src/repos/`)

**V1 Status:** Only supports single workspace (`workspaceFolders[0]`). This is v1 bug #2.

**V2 Requirements:**

- Iterate `vscode.workspace.workspaceFolders` to detect all open repos
- Support user-configured additional paths via `acm.additionalRepoPaths` setting
- Store per-repo metadata: `repoName`, `repoPath`, `remoteUrl`, `lastSyncedAt`
- Aggregate events and commits from all repos into a single unified timeline
- Display per-repo breakdown in reports and sidebar

---

### 3.9 Risk Detector (`src/git/riskDetector.ts`)

**V1 Status:** Partial — `setInterval` in v1 creates logs but doesn't raise risk alerts. `getChanges.js` provides the diff data.

**V2 Requirements:**

- Monitor `git status --porcelain` every 10 minutes across all tracked repos
- Trigger a VS Code warning notification if:
  - `>= riskThresholdLines` lines modified but not committed for `>= riskThresholdMinutes`
  - A file has been deleted but not committed
- Notification must include: repo name, change size, time since last commit, quick-action button to open Source Control panel
- Log all risk events to `~/.acm/risks.json`
- Show risk count in status bar (amber indicator)

---

## 4. VS Code Extension Interface

### 4.1 Status Bar Item

**V1 Status:** Does not exist (v1 bug #9).

**V2 Requirements:**

- Persistent item: `⏱ ACM: 4h 32m active today`
- Click opens the sidebar panel
- Turns **amber** if a risk is detected
- Shows a sync spinner during GitHub sync
- Updates every minute

### 4.2 Sidebar Panel (Tree View)

**V1 Status:** Does not exist — v1 has no sidebar.

**V2 Requirements:**

```
AUTO-COMMIT MATE++
├── 📅 Today's Activity
│   ├── Active: 4h 32m
│   └── Repos: ACM, backend-api
├── 📦 Work Units (This Week)
│   ├── 🟢 Secure Auth Migration [feature]
│   ├── 🔴 Fix setInterval Leak [bugfix]
│   └── 🔵 Migrate to TypeScript [refactor]
├── ⚠️ Risks
│   └── ACM: 78 lines uncommitted (1h 20m)
└── 📊 Reports
    ├── Generate Daily Report
    ├── Generate Weekly Report
    └── Ask a Question...
```

### 4.3 Commands (Command Palette)

| Command                   | ID                      | V1 Equivalent                   |
| ------------------------- | ----------------------- | ------------------------------- |
| Start Auto-Committing     | `acm.start`             | `extension.startAutoCommitting` |
| Set Commit Interval       | `acm.setInterval`       | `extension.setTimeDuration`     |
| Stop Auto-Committing      | `acm.stop`              | _(new)_                         |
| Generate Daily Report     | `acm.generateDaily`     | _(new)_                         |
| Generate Weekly Report    | `acm.generateWeekly`    | _(new)_                         |
| Generate Monthly Report   | `acm.generateMonthly`   | _(new)_                         |
| Generate Appraisal Report | `acm.generateAppraisal` | _(new)_                         |
| Ask About My Work         | `acm.askQuestion`       | _(new)_                         |
| Sync to GitHub            | `acm.syncNow`           | _(new)_                         |
| View Activity Log         | `acm.viewLog`           | _(new)_                         |
| Clear Credentials         | `acm.clearCredentials`  | _(new)_                         |
| Open Settings             | `acm.openSettings`      | _(new)_                         |

---

## 5. Settings (`package.json` contributes.configuration)

| Setting Key                 | Type     | Default | Description                                                                   |
| --------------------------- | -------- | ------- | ----------------------------------------------------------------------------- |
| `acm.enabled`               | boolean  | `true`  | Enable/disable all tracking                                                   |
| `acm.githubUsername`        | string   | `""`    | GitHub username (non-sensitive, replaces v1 key)                              |
| `acm.additionalRepoPaths`   | string[] | `[]`    | Extra Git repo paths to track                                                 |
| `acm.commitIntervalMinutes` | number   | `30`    | Interval between auto-commits (replaces v1 QuickPick, user can set any value) |
| `acm.idleThresholdMinutes`  | number   | `5`     | Minutes of inactivity before marking idle                                     |
| `acm.riskThresholdLines`    | number   | `50`    | Uncommitted line threshold for risk alert                                     |
| `acm.riskThresholdMinutes`  | number   | `60`    | Minutes before risk alert fires                                               |
| `acm.syncEnabled`           | boolean  | `false` | Auto-sync work logs to GitHub                                                 |
| `acm.syncFrequencyHours`    | number   | `24`    | How often to auto-sync                                                        |
| `acm.logRetentionDays`      | number   | `90`    | Days to keep local logs                                                       |
| `acm.showStartupPrompt`     | boolean  | `true`  | Show startup "Start ACM?" prompt (fix v1 bug #4)                              |

> **Removed from settings (v2):**
>
> - `autoCommitMate.githubToken` — moved to Secret Storage
>
> **Secrets (stored via `context.secrets`, never in settings):**
>
> - `acm.githubToken` — GitHub PAT
> - `acm.geminiApiKey` — Google Gemini API key

---

## 6. Data Models

### ActivityEvent

```typescript
interface ActivityEvent {
  eventId: string; // uuid-v4
  type: 'edit' | 'focus' | 'idle' | 'commit';
  filePath: string;
  repoRoot: string;
  repoName: string;
  timestamp: string; // ISO 8601
  linesAdded: number;
  linesRemoved: number;
  languageId: string;
  sessionId: string;
}
```

### WorkSession

```typescript
interface WorkSession {
  sessionId: string;
  repoName: string;
  repoPath: string;
  startTime: string; // ISO 8601
  endTime: string;
  activeMinutes: number;
  idleMinutes: number;
  filesEdited: string[];
  linesAdded: number;
  linesRemoved: number;
}
```

### CommitRecord

```typescript
interface CommitRecord {
  hash: string;
  message: string;
  author: string;
  timestamp: string;
  repoName: string;
  filesChanged: string[];
  diffStat: string; // raw output of `git diff --stat`
  linesAdded: number;
  linesRemoved: number;
  classification?: {
    type: WorkType;
    confidence: number;
    summary: string;
  };
  workUnitId?: string;
}
```

### WorkUnit

```typescript
interface WorkUnit {
  id: string;
  name: string; // AI-generated label
  type: WorkType;
  commits: string[]; // commit hashes
  repos: string[];
  startTime: string;
  endTime: string;
  totalLinesChanged: number;
}

type WorkType =
  | 'feature'
  | 'bugfix'
  | 'refactor'
  | 'docs'
  | 'test'
  | 'chore'
  | 'unknown';
```

### V1 Log Entry (for backward-compat parsing)

```typescript
// Represents a parsed v1 Activity-Logger Markdown file
interface V1LogEntry {
  date: string;
  startTime: string;
  endTime: string;
  changes: string[]; // bullet lines from v1 "### Changes:" section
  summary: string; // last line from v1 "### Summary:" section
  repoName?: string; // present only in global repo version
  sourceFile: string; // original .md filename
}
```

---

## 7. File & Folder Structure (V2 Target)

```
auto-commit-mate-plus/
├── src/
│   ├── extension.ts            # Entry point — activate/deactivate (TypeScript)
│   ├── tracker/
│   │   ├── activityTracker.ts  # vscode.workspace.onDidChangeTextDocument hooks
│   │   ├── sessionManager.ts   # Session boundary detection (idle threshold)
│   │   └── logWriter.ts        # Write structured JSON to ~/.acm/logs/
│   ├── git/
│   │   ├── gitClient.ts        # Async exec wrappers for git commands
│   │   ├── commitPoller.ts     # 5-min interval commit detection
│   │   └── riskDetector.ts     # Uncommitted change warnings
│   ├── ai/
│   │   ├── classifier.ts       # Gemini commit classification
│   │   ├── grouper.ts          # WorkUnit clustering
│   │   ├── reporter.ts         # AI narrative generation for reports
│   │   └── promptTemplates.ts  # All Gemini prompt strings
│   ├── repos/
│   │   └── repoManager.ts      # Multi-workspace repo detection
│   ├── reports/
│   │   ├── dailyReport.ts
│   │   ├── weeklyReport.ts
│   │   ├── appraisalReport.ts
│   │   └── exporters/
│   │       ├── markdownExporter.ts
│   │       ├── pdfExporter.ts
│   │       └── jsonExporter.ts
│   ├── sync/
│   │   └── githubSync.ts       # Evolution of v1 commitAndPushToGlobalRepo.js
│   ├── auth/
│   │   └── credentials.ts      # Migrated from v1 — uses context.secrets
│   ├── ui/
│   │   ├── sidebarProvider.ts  # VS Code TreeDataProvider
│   │   ├── statusBarItem.ts    # Live status bar widget
│   │   └── chatPanel.ts        # Natural language Q&A panel
│   ├── compat/
│   │   └── v1LogParser.ts      # Parse legacy v1 Activity-Logger .md files
│   └── utils/
│       ├── storage.ts          # ~/.acm/ read/write helpers
│       ├── secrets.ts          # context.secrets abstraction
│       ├── dateUtils.ts        # Date formatting (replaces v1 formatDate/formatTime)
│       └── uuid.ts             # UUID generation
├── test/
│   ├── tracker.test.ts
│   ├── classifier.test.ts
│   ├── grouper.test.ts
│   ├── gitClient.test.ts
│   └── v1LogParser.test.ts
├── Activity-Logger/            # V1 legacy folder — kept for backward compat, gitignored in v2
├── package.json                # Updated: new commands, settings, TypeScript build
├── tsconfig.json               # New
├── esbuild.js                  # New: bundle config
└── README.md
```

---

## 8. V1 → V2 Migration Plan

| Priority | V1 Bug / Gap                        | V2 Fix                                                             |
| -------- | ----------------------------------- | ------------------------------------------------------------------ |
| 🔴 P0    | PAT stored in plain `globalState`   | Migrate to `context.secrets` on first v2 activation                |
| 🔴 P0    | `setInterval` never cleared         | Store handle in `context.subscriptions` or `disposables`           |
| 🟠 P1    | Only single workspace supported     | Iterate `vscode.workspace.workspaceFolders`                        |
| 🟠 P1    | `execSync` blocks extension host    | Replace with async `exec` wrappers                                 |
| 🟡 P2    | Startup prompt fires every launch   | Add `acm.showStartupPrompt` setting (default `true`)               |
| 🟡 P2    | Only 3 hardcoded commit intervals   | Replace QuickPick with numeric input + `acm.commitIntervalMinutes` |
| 🟡 P2    | No status bar visibility            | Add `statusBarItem.ts`                                             |
| 🟢 P3    | `auto_init: false` on repo creation | Set `auto_init: true`                                              |
| 🟢 P3    | Cache dedup is raw string compare   | Hash-based deduplication with structured diff data                 |
| 🟢 P3    | No AI / no reports / no multi-repo  | All new modules in v2                                              |

---

## 9. Non-Functional Requirements

| Requirement               | V1 Actual                          | V2 Target                                                      |
| ------------------------- | ---------------------------------- | -------------------------------------------------------------- |
| Extension activation time | Not measured                       | < 500ms                                                        |
| Background CPU usage      | Not measured (blocking execSync)   | < 2% average (async, intervals)                                |
| Local storage per month   | ~1 MB (Markdown files)             | < 10 MB (structured JSON + Markdown)                           |
| AI API call latency       | N/A                                | < 5s per classification (show loading state)                   |
| Offline mode              | Fully functional (no AI in v1)     | All tracking & sync works; AI features degrade gracefully      |
| Privacy                   | Source code never sent (v1 spirit) | No source code sent to API — only commit messages & diff stats |
| Security                  | PAT in plain text ❌               | PAT & API keys in VS Code Secret Storage ✅                    |
| VS Code version support   | `^1.96.0`                          | `^1.96.0` (maintain)                                           |
| Node.js version           | `>= 18.x`                          | `>= 18.x` (maintain)                                           |

---

## 10. Enhancement Roadmap (Post-MVP v2.0)

| Phase | Feature                                                                       |
| ----- | ----------------------------------------------------------------------------- |
| v2.1  | VS Code Webview dashboard with charts (activity heatmap, work-type pie chart) |
| v2.2  | Slack / Teams webhook integration for automated weekly team reports           |
| v2.3  | Jira / Linear ticket linking (match commit keywords to ticket IDs)            |
| v2.4  | Team mode — aggregate work logs across a team repo                            |
| v2.5  | Local LLM support (Ollama) as a privacy-first alternative to Gemini API       |

---

## 11. Out of Scope (v2.0)

- Real-time collaboration or live sharing
- Billing or time-tracking for clients (no invoice generation)
- Code quality analysis or linting suggestions
- Modifying or rewriting commit messages automatically
- Any data leaving the machine except: (a) Gemini API calls with commit metadata only, (b) optional GitHub sync
- Removing the `Activity-Logger/` folder from existing repos (backward compat preserved)
