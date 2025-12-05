const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

const toggleCheck = document.getElementById('toggleCheck');
const statusDiv = document.getElementById('status');

browserAPI.storage.local.get(['enabled'], (result) => {
  const enabled = result.enabled !== false;
  toggleCheck.checked = enabled;
  updateStatus(enabled);
});

toggleCheck.addEventListener('change', (event) => {
  const enabled = event.target.checked;
  
  // Save state
  browserAPI.storage.local.set({ enabled: enabled }, () => {
    console.log('[SafeLink] Extension', enabled ? 'enabled' : 'disabled');
    updateStatus(enabled);
    
    // Notify all tabs
    browserAPI.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        browserAPI.tabs.sendMessage(tab.id, {
          action: 'toggleExtension',
          enabled: enabled
        }).catch(() => {
          // Ignore errors for tabs without content script
        });
      });
    });
  });
});

function updateStatus(enabled) {
  if (enabled) {
    statusDiv.textContent = '✓ Extension activée';
    statusDiv.className = 'status enabled';
  } else {
    statusDiv.textContent = '✗ Extension désactivée';
    statusDiv.className = 'status disabled';
  }
}
