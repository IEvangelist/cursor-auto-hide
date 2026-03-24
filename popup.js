const settingsKey = "enabled";
const toggle = document.getElementById("enabledToggle");
const statusText = document.getElementById("statusText");
const versionText = document.getElementById("versionText");

function render(enabled) {
  toggle.checked = enabled;
  statusText.textContent = enabled
    ? "Hides the pointer while typing in editable controls."
    : "Disabled. Sites keep their normal pointer behavior.";
  versionText.textContent = `v${chrome.runtime.getManifest().version}`;
}

chrome.storage.sync.get({ [settingsKey]: true }, (values) => {
  render(values[settingsKey] !== false);
});

toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  chrome.storage.sync.set({ [settingsKey]: enabled }, () => render(enabled));
});
