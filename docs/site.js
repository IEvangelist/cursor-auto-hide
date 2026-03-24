const copyButtons = document.querySelectorAll('[data-copy-url]');

function copyWithExecCommand(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error(`Unable to copy ${text}.`);
  }
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    }
    catch {
      copyWithExecCommand(text);
      return;
    }
  }

  copyWithExecCommand(text);
}

for (const button of copyButtons) {
  const defaultStatus = button.querySelector('[data-copy-status]')?.textContent ?? 'Copy';
  let resetHandle;

  button.addEventListener('click', async () => {
    const { copyUrl } = button.dataset;

    if (!copyUrl) {
      return;
    }

    try {
      await copyText(copyUrl);
      button.dataset.copyState = 'copied';

      const status = button.querySelector('[data-copy-status]');
      if (status) {
        status.textContent = 'Copied';
      }

      clearTimeout(resetHandle);
      resetHandle = setTimeout(() => {
        button.dataset.copyState = 'idle';

        const resetStatus = button.querySelector('[data-copy-status]');
        if (resetStatus) {
          resetStatus.textContent = defaultStatus;
        }
      }, 1800);
    }
    catch {
      window.prompt('Copy this address into the browser address bar:', copyUrl);
    }
  });
}
