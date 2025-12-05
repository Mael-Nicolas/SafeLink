/**
 * SafeLink Service Worker
 * Background script for checking URL safety
 */

const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

importScripts('config.js');

const API_BASE_URL = 'https://www.ipqualityscore.com/api/json/url';

/**
 * Check if a URL is unsafe using IPQualityScore API
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} - Returns true if the URL is unsafe, false if safe
 */
async function isUrlUnsafe(url) {
  try {
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `${API_BASE_URL}/${CONFIG.API_KEY}/${encodedUrl}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
      return false;
    }
    const data = await response.json();
    if (!data.success) {
      console.error('API returned error:', data.message);
      return false;
    }
    return data.unsafe === true;
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
