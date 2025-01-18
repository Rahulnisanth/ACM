const vscode = require("vscode");

async function showTimeDurationSelector() {
  const options = [
    { label: "1 minute", value: 1 },
    { label: "2 minutes", value: 2 },
    { label: "30 minutes", value: 30 },
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
