/**
 * SafeLink Content Script
 * Detects URL hovers and sends them to the background service worker
 */

const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

let hoverTimeout = null;
let currentLink = null;
let badge = null;
let isEnabled = true;

// Load CSS
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = browserAPI.runtime.getURL('scripts/styles.css');
document.head.appendChild(link);

// Load saved state
browserAPI.storage.local.get(['enabled'], (result) => {
  isEnabled = result.enabled !== false; // Default to true
  console.log('[SafeLink] Content script loaded, enabled:', isEnabled);
});

// Listen for toggle messages
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleExtension') {
    isEnabled = request.enabled;
    console.log('[SafeLink] Extension toggled:', isEnabled);
    if (!isEnabled) {
      removeBadge();
      clearTimeout(hoverTimeout);
    }
  }
});

function createBadge(text, icon, className) {
  const div = document.createElement('div');
  div.className = `safelink-badge ${className}`;
  
  if (className === 'loading') {
    div.innerHTML = `<div class="safelink-spinner"></div><span>${text}</span>`;
  } else {
    div.innerHTML = `<span>${icon}</span><span>${text}</span>`;
  }
  
  document.body.appendChild(div);
  return div;
}

function positionBadge(link) {
  if (!badge) return;
  
  const rect = link.getBoundingClientRect();
  badge.style.left = (rect.left + rect.width / 2 - badge.offsetWidth / 2) + 'px';
  badge.style.top = (rect.top - 35) + 'px';
}

function removeBadge() {
  if (badge) {
    badge.remove();
    badge = null;
  }
}

document.addEventListener('mouseover', (event) => {
  const link = event.target.closest('a');
  if (!link || !link.href || !isEnabled) {
    clearTimeout(hoverTimeout);
    removeBadge();
    currentLink = null;
    return;
  }

  currentLink = link;
  removeBadge();

  // Show badge after 0.5s
  setTimeout(() => {
    if (currentLink === link && !badge) {
      badge = createBadge('Vérification...', '', 'loading');
      positionBadge(link);
    }
  }, 500);

  hoverTimeout = setTimeout(() => {
    const url = link.href;
    console.log('[SafeLink] URL hovered for 1.5s:', url);
    
    try {
      browserAPI.runtime.sendMessage(
        { action: 'checkUrl', url: url },
        (response) => {
          if (chrome.runtime.lastError) {
            console.warn('[SafeLink] Runtime error:', chrome.runtime.lastError);
            removeBadge();
            return;
          }
          
          if (response && badge && currentLink === link) {
            console.log('[SafeLink] Safety check result:', response);
            if (response.unsafe) {
              console.warn('[SafeLink] ⚠️ UNSAFE URL:', url);
              badge.className = 'safelink-badge unsafe';
              badge.innerHTML = '<span>Pas sûr</span>';
            } else {
              console.log('[SafeLink] ✓ Safe URL:', url);
              badge.className = 'safelink-badge safe';
              badge.innerHTML = '<span>Sûr</span>';
            }
            positionBadge(currentLink);
          }
        }
      );
    } catch (error) {
      console.error('[SafeLink] Error sending message:', error);
      removeBadge();
    }
  }, 1250);
});

document.addEventListener('mouseout', (event) => {
  const link = event.target.closest('a');
  if (link) {
    clearTimeout(hoverTimeout);
    removeBadge();
    currentLink = null;
  }
});

window.addEventListener('scroll', () => {
  if (badge && currentLink) {
    positionBadge(currentLink);
  }
});
