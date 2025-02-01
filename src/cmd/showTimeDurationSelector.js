const vscode = require("vscode");
/**
 * Pops up a quick selector for selecting time durations.
 */
async function showTimeDurationSelector() {
  const options = [
    { label: "⏰ 15 minutes", value: 15 },
    { label: "⏰ 30 minutes", value: 30 },
    { label: "⏰ 45 minutes", value: 45 },
  ];

  const selectedOption = await vscode.window.showQuickPick(
    options.map((option) => option.label),
    {
      placeHolder: "🕒 Select a time duration for auto-committing the logs",
    }
  );

  if (selectedOption) {
    const duration = options.find(
      (option) => option.label === selectedOption
    ).value;

    return duration;
  }

  vscode.window.showInformationMessage(
    "🔔 Default duration of 30 minutes is set for auto-committing logs."
  );

  return 30; // Setting 30 minutes by default
}

module.exports = showTimeDurationSelector;
