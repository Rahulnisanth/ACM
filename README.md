# Auto Commit Mate (ACM) Documentation

## Introduction

**Auto Commit Mate** (ACM) is a productivity-boosting extension for Visual Studio Code that simplifies your workflow. With ACM, you can effortlessly ensure every change in your project is tracked and committed to your repository. This extension automatically commits and pushes changes to GitHub at customizable time intervals, helping you maintain an active and vibrant GitHub contribution graph.

Additionally, ACM now supports **global repository-based work logs** by pushing commit logs to a centralized `Activity-Logger` repository on GitHub. This new feature allows users to track all their work logs in a single global repository.

## Features

- **Automatic Commits**: Automatically commit changes in your workspace without needing to manually stage and commit.
- **Time-Based Commit Intervals**: Set time intervals to automatically commit changes at regular intervals.
- **Detailed Commit Logs**: ACM generates detailed commit messages based on your file changes.
- **GitHub Integration**: Automatically pushes commits to your GitHub repository.
- **Global Repository Support**: ACM pushes commit logs to a global `Activity-Logger` repository on GitHub, providing a centralized location for all project logs.
- **Customizable Settings**: You can configure the time duration, GitHub repository, and commit messages.

## Installation

To install **Auto Commit Mate** (ACM):

1. Open **Visual Studio Code**.
2. Go to the **Extensions Marketplace** by clicking the Extensions icon in the Activity Bar on the side of the window.
3. Search for **Auto Commit Mate**.
4. Click on **Install**.

Alternatively, you can install it directly from the command palette by typing `ext install Rahulnisanth.auto-commit-mate`.

## Configuration

After installation, you need to configure the extension by adding your GitHub username and Personal Access Token (PAT). Follow these steps:

### GitHub Authentication and Personal Access Token (PAT)

To connect ACM with your GitHub account and authenticate using a GitHub Personal Access Token (PAT), follow these steps:

1. **Generate a GitHub Personal Access Token (PAT)**:

   - Go to your GitHub account, and navigate to [GitHub Personal Access Tokens settings](https://github.com/settings/tokens).
   - Click on **Generate new token**.
   - Provide a token name and select the following scopes:
     - `repo`: Full control of private repositories.
     - `workflow`: To trigger workflows.
     - `public_repo`: To access public repositories.
     - `gist`: If you wish to access gists.
   - Click on **Generate token**.
   - Copy the generated token. This is important, as it will not be shown again.

### Set Auto-Commit Time Duration

To configure the interval at which the extension commits automatically:

1. Open the command palette (press `Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. Type and select **"Set time duration for auto-committing logs"**.
3. Enter the desired time duration in minutes.

This will set how often the extension will automatically commit your changes.

### Start the Auto Commit Mate

To start the auto-commit process:

1. Open the command palette again.
2. Type and select **"Start the Auto-Commit extension"**.
3. The extension will begin monitoring your workspace and commit changes at the set intervals.

### Global Repository Setup (Activity-Logger)

Once the GitHub credentials are set, ACM will push all logs to a **global `Activity-Logger` repository**. This repository will store commit logs from all projects, helping you centralize your work logs for easy tracking and reference.

To ensure logs are pushed to the global repository:

- The repository will be created automatically upon first use if it doesn't already exist. ACM will check and create it if needed.
- Logs are committed in Markdown format (`[YYYY-MM-DD: HH:mm to HH:mm].md`), containing a summary of the work done during that interval.

---

## Commands

**Auto Commit Mate** offers the following primary commands:

### `extension.startAutoCommitting`

Starts the auto-commit process. Once started, ACM will automatically commit changes in your workspace at regular intervals.

### `extension.setTimeDuration`

Sets the time duration between each auto-commit. You can specify this duration in minutes.

---

## Usage

Once the extension is installed and configured, you can simply let it run in the background as you work. ACM will monitor your workspace for file changes and commit them automatically at the interval you set.

The commits will include detailed messages about which files were modified, and they will be pushed directly to your GitHub repository as well as to your global `Activity-Logger` repository.

---

## Example Log File

When ACM generates a log file, the content will look like this:

```
Project Logs

Date: Jan 12, 2025
Time: 11:00 PM to 11:30 PM

Changes:
- file1.js
- file2.html

Summary:
Modified 2 files 2+ | 0-
```

---

## Troubleshooting

### The extension is not committing automatically

- Ensure that the Git repository is correctly initialized and that your workspace contains a `.git` directory.
- Make sure you've set a valid time duration for auto-committing logs.

### I don't want auto-commits to happen anymore

- You can stop the auto-commit process by disabling the extension or closing VS Code.

### My commits aren't showing up on GitHub

- Verify that you have connected your GitHub account and that your repository is set up correctly for pushing commits.
- Check the extension logs for any errors related to GitHub authentication.

### GitHub Personal Access Token (PAT) Authentication Issues

- Double-check that your **GitHub Username** and **PAT** are correctly entered.
- Ensure your PAT has the appropriate permissions (`repo` and `workflow`).

---

## Contributing

Contributions are welcome! If you'd like to help improve the **Auto Commit Mate - ACM** extension, please follow these steps:

1. Fork the repository.
2. Clone your fork to your local machine.
3. Make your changes.
4. Create a pull request with a description of your changes.

For more details, visit the repository's **[GitHub page](https://github.com/Rahulnisanth/ACM)**.
