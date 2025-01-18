const vscode = require("vscode");
/**
 * Pops up a quick selector for selecting time durations.
 */
async function showTimeDurationSelector() {
  const options = [
    { label: "0.5 minute", value: 0.5 },
    { label: "30 minutes", value: 30 },
    { label: "45 minutes", value: 45 },
    { label: "60 minutes", value: 60 },
  ];

  const selectedOption = await vscode.window.showQuickPick(
    options.map((option) => option.label),
    {
      placeHolder: "Select a timer duration for auto-committing logs",
    }
  );

  if (selectedOption) {
    const duration = options.find(
      (option) => option.label === selectedOption
    ).value;

    vscode.window.showInformationMessage(
      `✅ Selected ${selectedOption} for auto-committing the logs`
    );

    return duration;
  }
  return 30; // Setting 30 minutes by default
}

module.exports = showTimeDurationSelector;
