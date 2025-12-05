/**
 * SafeLink Service Worker
 * Background script for checking URL safety
 */

const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

const API_BASE_URL = 'https://phishark.com/api/check-url';

/**
 * Check if a URL is unsafe using PhiShark API
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} - Returns true if the URL is unsafe, false if safe
 */
async function isUrlUnsafe(url) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        private_mode: true
      })
    });
    
    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
      return false;
    }
    
    const data = await response.json();
    
    // PhiShark returns a decision field: "allow" or "block"
    // and a malicious_probability score (0-1)
    const isUnsafe = data.decision === 'block' || data.malicious_probability > 0.5;
    
    console.log('[SafeLink] PhiShark analysis:', {
      decision: data.decision,
      probability: data.malicious_probability,
      unsafe: isUnsafe
    });
    
    return isUnsafe;
  } catch (error) {
    console.error('Error checking URL safety:', error);
    return false;
  }
}

/**
 * Listen for messages from content scripts
 */
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkUrl') {
    const url = request.url;
    console.log('[SafeLink] Checking URL:', url);
    
    isUrlUnsafe(url)
      .then((unsafe) => {
        const result = {
          url: url,
          unsafe: unsafe,
          timestamp: new Date().toISOString()
        };
        console.log('[SafeLink] Result:', result);
        sendResponse(result);
      })
      .catch((error) => {
        console.error('[SafeLink] Error:', error);
        sendResponse({ url: url, unsafe: false, error: error.message });
      });
    
    return true;
  }
});
