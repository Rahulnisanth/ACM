# Commit Mate

## Project Overview

Commit Mate is a VS Code extension designed to help developers track their workflow and automatically generate detailed commit logs for each work session. This extension helps organize project history, track file changes, and push logs to GitHub without manual intervention.

## Features

### 1. Project Initialization

#### Detect Project Opened in VS Code
- The extension checks for the existence of a `project-history` folder each time a user opens a project in VS Code.

#### Auto/Prompted Initialization
- If the folder is not found, the user will be prompted to initialize the project history folder automatically.
- If the folder already exists, no action is required.

### 2. File Change Tracking

#### Automatic Tracking
- The extension monitors file changes within the project folder every 30 minutes.

#### Debouncing for Short Sessions
- If the user switches projects or stops working within 30 minutes, the extension debounces and handles partial work summaries appropriately.

### 3. Generate Workflow Summary

#### Create/Update README File
- The extension automatically creates or updates a `README.md` file inside the `project-history` folder with a filename formatted as `<Date> - <Start time> to <End time> log`.
- The README includes:
  - Date and time of the session.
  - List of files modified, added, or deleted.
  - A short summary of the work done.

#### Example README Format:

```
Project Logs

Date: 2024-12-24
Time: 10:00 AM - 10:30 AM

Summary:
- M main.js (20 lines added, 5 lines removed)
- C README.md
- D temp.txt
```

### 4. Push Changes to GitHub

#### Selective Push
- Only the `project-history` folder is pushed to the GitHub repository associated with the project.

#### Automated Push
- The push occurs automatically after generating the summary, without requiring manual intervention.
