const settingsKey = "enabled";
const toggle = document.getElementById("enabledToggle");
const statusText = document.getElementById("statusText");
const versionText = document.getElementById("versionText");
const extensionApi = globalThis.chrome?.runtime?.getManifest ? globalThis.chrome : null;
const storage = extensionApi?.storage?.sync ?? null;

function render(enabled) {
  toggle.checked = enabled;
  statusText.textContent = enabled
    ? "Hides the pointer while typing in editable controls."
    : "Disabled. Sites keep their normal pointer behavior.";
  versionText.textContent = extensionApi ? `v${extensionApi.runtime.getManifest().version}` : "Preview mode";
}

if (storage) {
  storage.get({ [settingsKey]: true }, (values) => {
    render(values[settingsKey] !== false);
  });
} else {
  render(true);
}

toggle.addEventListener("change", () => {
  const enabled = toggle.checked;

  if (!storage) {
    render(enabled);
    return;
  }

  storage.set({ [settingsKey]: enabled }, () => render(enabled));
});
