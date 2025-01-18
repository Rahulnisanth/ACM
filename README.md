# Auto Commit Mate (ACM) Documentation

## Introduction

**Auto Commit Mate** (ACM) is a productivity-focused extension for Visual Studio Code designed to automate the process of committing changes to your Git repository. ACM helps developers track their workflow, generate detailed commit logs, and push them to GitHub with minimal manual intervention. The extension ensures that every change is committed with a timestamp and an auto-generated commit message, saving time and reducing human error.

## Features

- **Automatic Commits**: Automatically commit changes in your workspace without needing to manually stage and commit.
- **Time-Based Commit Intervals**: Set time intervals to automatically commit changes at regular intervals.
- **Detailed Commit Logs**: ACM generates detailed commit messages based on your file changes.
- **GitHub Integration**: Automatically pushes commits to your GitHub repository.
- **Customizable Settings**: You can configure the time duration and customize commit messages.

## Installation

To install **Auto Commit Mate** (ACM):

1. Open **Visual Studio Code**.
2. Go to the **Extensions Marketplace** by clicking the Extensions icon in the Activity Bar on the side of the window.
3. Search for **Auto Commit Mate**.
4. Click on **Install**.

Alternatively, you can install it directly from the command palette by typing `ext install team-insiders.auto-commit-mate`.

## Configuration

After installation, you can configure the extension via the **VS Code settings** or using the command palette. Here's how you can configure different aspects of the extension:

### Set Auto-Commit Time Duration

To configure the interval at which the extension commits automatically:

1. Open the command palette (press `Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. Type and select **"Set time duration for auto-committing logs"**.
3. Enter the desired time duration in minutes.

This will set how often the extension will automatically commit your changes.

### Start the Auto-Committer

To start the auto-commit process:

1. Open the command palette again.
2. Type and select **"Start the Auto-Commit extension"**.
3. The extension will begin monitoring your workspace and commit changes at the set intervals.

## Commands

**Auto Commit Mate** offers two primary commands:

### `extension.startAutoCommitter`

Starts the auto-commit process. Once started, ACM will automatically commit changes in your workspace at regular intervals.

### `extension.setTimeDuration`

Sets the time duration between each auto-commit. You can specify this duration in minutes.

## Usage

Once the extension is installed and configured, you can simply let it run in the background as you work. ACM will monitor your workspace for file changes and commit them automatically at the interval you set.

The commits will include detailed messages about which files were modified, and they will be pushed directly to your GitHub repository.

## Example Commit Message

When ACM makes a commit, the message will look like this:

```
Project Logs

Date: Jan 12, 2025
Time: 11:00 PM to 11:30 PM

Changes made to the following files:
- file1.js
- file2.html

Summary:
Modified 2 files 2+ | 0-
```

## Troubleshooting

### The extension is not committing automatically

- Ensure that the Git repository is correctly initialized and that your workspace contains a `.git` directory.
- Make sure you've set a valid time duration for auto-committing logs.

### I don't want auto-commits to happen anymore

- You can stop the auto-commit process by disabling the extension or closing VS Code.

### My commits aren't showing up on GitHub

- Verify that you have connected your GitHub account and that your repository is set up correctly for pushing commits.
- Check the extension logs for any errors related to GitHub authentication.

## Contributing

Contributions are welcome! If you'd like to help improve the **Auto Commit Mate - ACM** extension, please follow these steps:

1. Fork the repository.
2. Clone your fork to your local machine.
3. Make your changes.
4. Create a pull request with a description of your changes.

For more details, visit the repository's **[GitHub page](https://github.com/Rahulnisanth/AutoCommitMate-ACM)**.

## License

This extension is licensed under the **MIT License**.
