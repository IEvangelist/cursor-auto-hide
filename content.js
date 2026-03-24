(() => {
  const settingsKey = "enabled";
  const rootAttribute = "data-cursor-auto-hide";
  const styleElementId = "cursor-auto-hide-style";
  const hideDurationMs = 1200;
  const editingKeys = new Set(["Backspace", "Delete", "Enter", "NumpadEnter"]);
  const nonTextInputTypes = new Set([
    "button",
    "checkbox",
    "color",
    "file",
    "hidden",
    "image",
    "radio",
    "range",
    "reset",
    "submit"
  ]);

  let enabled = true;
  let revealTimer = null;

  function ensureStyleElement() {
    if (!document.documentElement || document.getElementById(styleElementId)) {
      return;
    }

    const style = document.createElement("style");
    style.id = styleElementId;
    style.textContent = `
      html[${rootAttribute}="hidden"],
      html[${rootAttribute}="hidden"] * {
        cursor: none !important;
      }
    `;

    document.documentElement.append(style);
  }

  function isTextInput(element) {
    if (!(element instanceof HTMLInputElement) || element.disabled || element.readOnly) {
      return false;
    }

    return !nonTextInputTypes.has((element.type || "").toLowerCase());
  }

  function isEditableElement(element) {
    if (!(element instanceof Element)) {
      return false;
    }

    if (element instanceof HTMLTextAreaElement) {
      return !element.disabled && !element.readOnly;
    }

    if (element instanceof HTMLInputElement) {
      return isTextInput(element);
    }

    return element.isContentEditable;
  }

  function findEditableElement(startNode) {
    let currentNode =
      startNode instanceof Node
        ? startNode.nodeType === Node.TEXT_NODE
          ? startNode.parentElement
          : startNode
        : null;

    while (currentNode) {
      if (currentNode instanceof Element && isEditableElement(currentNode)) {
        return currentNode;
      }

      currentNode = currentNode instanceof Element ? currentNode.parentElement : null;
    }

    const activeElement = document.activeElement;
    return activeElement instanceof Element && isEditableElement(activeElement) ? activeElement : null;
  }

  function hasEditableContext(startNode) {
    return findEditableElement(startNode) !== null;
  }

  function clearRevealTimer() {
    if (revealTimer !== null) {
      window.clearTimeout(revealTimer);
      revealTimer = null;
    }
  }

  function setCursorHidden(hidden) {
    ensureStyleElement();

    if (!document.documentElement) {
      return;
    }

    if (hidden) {
      document.documentElement.setAttribute(rootAttribute, "hidden");
      return;
    }

    document.documentElement.removeAttribute(rootAttribute);
  }

  function revealCursor() {
    clearRevealTimer();
    setCursorHidden(false);
  }

  function scheduleReveal() {
    clearRevealTimer();
    revealTimer = window.setTimeout(() => {
      setCursorHidden(false);
      revealTimer = null;
    }, hideDurationMs);
  }

  function hideCursorWhileTyping(startNode) {
    if (!enabled || !hasEditableContext(startNode)) {
      revealCursor();
      return;
    }

    setCursorHidden(true);
    scheduleReveal();
  }

  function isTypingKey(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return false;
    }

    return event.key.length === 1 || editingKeys.has(event.key) || event.isComposing;
  }

  function handleKeydown(event) {
    if (isTypingKey(event)) {
      hideCursorWhileTyping(event.target);
    }
  }

  function handleFocusChange() {
    window.setTimeout(() => {
      if (!hasEditableContext(document.activeElement)) {
        revealCursor();
      }
    }, 0);
  }

  document.addEventListener("keydown", handleKeydown, true);
  document.addEventListener("beforeinput", (event) => hideCursorWhileTyping(event.target), true);
  document.addEventListener("compositionstart", (event) => hideCursorWhileTyping(event.target), true);
  document.addEventListener("pointermove", revealCursor, true);
  document.addEventListener("pointerdown", revealCursor, true);
  document.addEventListener("wheel", revealCursor, { capture: true, passive: true });
  document.addEventListener("touchstart", revealCursor, { capture: true, passive: true });
  document.addEventListener("focusin", handleFocusChange, true);
  window.addEventListener("blur", revealCursor, true);
  window.addEventListener("pagehide", revealCursor, true);
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.visibilityState !== "visible") {
        revealCursor();
      }
    },
    true
  );

  chrome.storage.sync.get({ [settingsKey]: true }, (values) => {
    enabled = values[settingsKey] !== false;

    if (!enabled) {
      revealCursor();
    }
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync" || !Object.prototype.hasOwnProperty.call(changes, settingsKey)) {
      return;
    }

    enabled = changes[settingsKey].newValue !== false;

    if (!enabled) {
      revealCursor();
    }
  });

  ensureStyleElement();
})();
