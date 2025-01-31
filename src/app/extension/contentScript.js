const cleanText = require('./lib/cleanText/cleanText');
const keepSpacing = require('./lib/keepSpacing/keepSpacing');
const splitSpaces = require('./lib/removeExtraWhitespace/splitSpaces');
const processWord = require('./lib/processWord/processWord');
const spacingElementsList = require('./lib/spacedElementsList/spacedElementsList');
const styledSpan = require('./lib/styledSpan/styledSpan');

let isSiteReadEnabled = false;

// Sync initial state from storage
chrome.storage.sync.get(['siteReadEnabled'], (result) => {
  isSiteReadEnabled = result.siteReadEnabled || false;
  if (isSiteReadEnabled) applySiteRead();
});

// Listen for toggle messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleSiteRead') {
    isSiteReadEnabled = request.state;
    toggleSiteRead();
    sendResponse({ status: 'SiteRead toggled', enabled: isSiteReadEnabled });
  }
});

function applySiteRead() {
  if (!isSiteReadEnabled) return;

  const elements = document.querySelectorAll('p, li, a, em, ul, ol');
  elements.forEach((element) => {
    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
        const text = cleanText(node.nodeValue);
        const processedText = splitSpaces(text)
          .map(keepSpacing)
          .map(processWord)
          .join('');
        const span = styledSpan(processedText);
        node.replaceWith(span);
      }
    });
  });
  spacingElementsList(document.body);
}

function toggleSiteRead() {
  if (isSiteReadEnabled) {
    applySiteRead();
  } else {
    location.reload(); // Reload the page to reset the DOM
  }
}
