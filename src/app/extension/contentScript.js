const cleanText = require('./lib/cleanText/cleanText');
const keepSpacing = require('./lib/keepSpacing/keepSpacing');
const splitSpaces = require('./lib/removeExtraWhitespace/splitSpaces');
const processWord = require('./lib/processWord/processWord')
const spacingElementsList = require('./lib/spacedElementsList/spacedElementsList')


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);
  if (request.action === 'toggleSiteRead') {
    isSiteReadEnabled = request.state;
    console.log('Toggling SiteRead, new state:', isSiteReadEnabled);
    toggleSiteRead();
    sendResponse({ status: 'SiteRead toggled' });
  }
});


let isSiteReadEnabled = true; // Track if the site read is enabled

function applySiteRead() {
  if (!isSiteReadEnabled) return;

  // Only target text-related elements
  const elements = document.querySelectorAll('p, li, a, em, ul, ol');

  elements.forEach((element) => {
    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.nodeValue;

        // Clean and process the text
        text = cleanText(text);
        const words = splitSpaces(text);

        const siteReadText = words
          .map((word) => {
            const cleanWord = keepSpacing(word);
            return processWord(cleanWord);
          })
          .join('');

        const span = document.createElement('span');
        span.style.display = 'inline'; // Ensure spans don't disrupt layout
        span.innerHTML = siteReadText;
        node.replaceWith(span);
      }
    });
  });

  // Adjust inline element spacing
  spacingElementsList(document.body);
}


function toggleSiteRead() {
  isSiteReadEnabled = !isSiteReadEnabled;

  if (isSiteReadEnabled) {
    applySiteRead(); // Apply the effect when toggled on
    observer.observe(document.body, { childList: true, subtree: true }); // Re-observe for changes
  } else {
    // Disconnect the observer and remove formatting
    observer.disconnect();
    document.querySelectorAll('span').forEach((span) => {
      if (span.parentNode) {
        span.replaceWith(...span.childNodes); // Remove the span while preserving its content
      }
    });
    spacingElementsList(document.body);
  }
}

// Reapply site read when DOM changes (for dynamic pages)
const observer = new MutationObserver(() => {
  if (isSiteReadEnabled) applySiteRead(); // Reapply the site read effect on DOM changes
});

// Initial call to apply site read on page load
applySiteRead();
