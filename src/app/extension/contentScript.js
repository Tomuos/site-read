// contentScript.js

const cleanText = require('./lib/cleanText/cleanText');
const keepSpacing = require('./lib/keepSpacing/keepSpacing');
const splitSpaces = require('./lib/removeExtraWhitespace/splitSpaces');
const processWord = require('./lib/processWord/processWord');
const spacingElementsList = require('./lib/spacedElementsList/spacedElementsList');
const styledSpan = require('./lib/styledSpan/styledSpan');

let isSiteReadEnabled = false;
let observer = null;

// 1) Load initial state from storage
chrome.storage.sync.get(['siteReadEnabled'], (result) => {
  isSiteReadEnabled = result.siteReadEnabled || false;
  if (isSiteReadEnabled) {
    applySiteRead(document.body);
    startMutationObserver();
  }
});

// 2) Listen for toggle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleSiteRead') {
    isSiteReadEnabled = request.state;
    toggleSiteRead();
    sendResponse({ status: 'SiteRead toggled', enabled: isSiteReadEnabled });
  }
});

// 3) Main function to apply transformations
function applySiteRead(root = document.body) {
  if (!isSiteReadEnabled) return;

  // Query a set of text-containing elements
  const elements = root.querySelectorAll('p, li, a, em, ul, ol, div, span, article, section');
  
  elements.forEach((element) => {
    // If this element was already processed, skip it
    if (element.dataset.bionicProcessed === 'true') {
      return;
    }

    let didProcess = false;

    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
        didProcess = true;
        const text = cleanText(node.nodeValue);
        const processedText = splitSpaces(text)
          .map(keepSpacing)
          .map(processWord)
          .join('');
        const span = styledSpan(processedText);

        // Optionally mark the span so we know it's transformed text
        span.dataset.bionicProcessed = 'true';

        // Replace the original text node
        node.replaceWith(span);
      }
    });

    // If we processed anything, mark the parent so we don’t do it again
    if (didProcess) {
      element.dataset.bionicProcessed = 'true';
    }
  });

  // Apply spacing logic
  spacingElementsList(root);
}

// 4) Toggle function
function toggleSiteRead() {
  if (isSiteReadEnabled) {
    applySiteRead(document.body);
    startMutationObserver();
  } else {
    stopMutationObserver();
    location.reload(); // Reload page to reset DOM
  }
}

// 5) Start the MutationObserver
function startMutationObserver() {
  if (observer) return; // don’t start twice

  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          // If a new node is an element, apply reading to its subtree
          if (node.nodeType === Node.ELEMENT_NODE) {
            applySiteRead(node);
          }
        });
      }
      if (mutation.type === 'characterData') {
        // If text content changes, re-apply to its parent
        const parent = mutation.target.parentNode;
        if (parent) {
          applySiteRead(parent);
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true,
  });
}

// 6) Stop the MutationObserver
function stopMutationObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}
