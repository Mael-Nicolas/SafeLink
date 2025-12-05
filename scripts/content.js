/**
 * SafeLink Content Script
 * Detects URL hovers and sends them to the background service worker
 */

const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

let hoverTimeout = null;

document.addEventListener('mouseover', (event) => {
  const link = event.target.closest('a');
  if (!link || !link.href) {
    clearTimeout(hoverTimeout);
    return;
  }

  hoverTimeout = setTimeout(() => {
    const url = link.href;
    console.log('[SafeLink] URL hovered for 2s:', url);
    
    browserAPI.runtime.sendMessage(
      { action: 'checkUrl', url: url },
      (response) => {
        if (response) {
          console.log('[SafeLink] Safety check result:', response);
          if (response.unsafe) {
            console.warn('[SafeLink] ⚠️ UNSAFE URL:', url);
            // TODO: Visual indicator
          } else {
            console.log('[SafeLink] ✓ Safe URL:', url);
          }
        }
      }
    );
  }, 2000);
});

document.addEventListener('mouseout', (event) => {
  const link = event.target.closest('a');
  if (link) clearTimeout(hoverTimeout);
});
