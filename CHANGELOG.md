# Changelog

## [1.0.8] - 2025-02-02

### Added

- Latest release of **Auto Commit Mate (ACM)**.
- Automatically commits changes in the workspace at set intervals.
- Configurable commit time duration (in minutes).
- Automatically pushes commits to GitHub with detailed commit messages.
- Two primary commands:
  - `extension.startAutoCommitting`: Starts the auto-commit process.
  - `extension.setTimeDuration`: Sets the time duration between auto-commits.
- **Global Repository Support**: Commits are now also pushed to a central `Activity-Logger` GitHub repository.
- GitHub Personal Access Token (PAT) authentication for seamless integration with GitHub.

### Fixed

- N/A (Latest release)

### Changed

- Added quick selector on the mount of the extension.
- Updated the codebase comments to reflect the new features.
- Improved GitHub integration to handle global repository logging.
- Fixed the startup bug
