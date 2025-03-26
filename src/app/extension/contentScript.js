
const { injectGoogleFonts, getChosenFont } = require('./fonts.js');

const cleanText = require('./lib/cleanText/cleanText');
const keepSpacing = require('./lib/keepSpacing/keepSpacing');
const splitSpaces = require('./lib/removeExtraWhitespace/splitSpaces');
const processWord = require('./lib/processWord/processWord');
const spacingElementsList = require('./lib/spacedElementsList/spacedElementsList');
const styledSpan = require('./lib/styledSpan/styledSpan');
const { startObserver, stopObserver } = require('./domObserver.js');

let isSiteReadEnabled = false;
let observer = null;
let chosenFont = '"Open Sans", sans-serif'; // fallback if none is set

// Load initial state from storage
chrome.storage.sync.get(['siteReadEnabled'], (result) => {
  isSiteReadEnabled = result.siteReadEnabled || false;

  if (isSiteReadEnabled) {
    getChosenFont((font) => {
      chosenFont = font;
      injectGoogleFonts();
      applySiteRead(document.body);
      observer = startObserver(applySiteRead);
    });
  }
});

// Listen for toggle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleSiteRead') {
    isSiteReadEnabled = request.state;
    toggleSiteRead();
    sendResponse({ status: 'SiteRead toggled', enabled: isSiteReadEnabled });
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.chosenFont) {
    chosenFont = changes.chosenFont.newValue || '"Open Sans", sans-serif';
    injectGoogleFonts();

    // 🔥 FIRST: Revert spans back to plain text nodes before reprocessing
    document.querySelectorAll('span[data-bionic-processed="true"]').forEach((span) => {
      span.replaceWith(span.textContent);
    });

    // 🔥 SECOND: Clear dataset flags from parent elements to force full reprocessing
    document.querySelectorAll('[data-bionic-processed="true"]').forEach((el) => {
      delete el.dataset.bionicProcessed;
    });

    // 🔥 FINALLY: Apply the reading style again
    applySiteRead(document.body);
  }
});

function applySiteRead(root = document.body) {
  if (!isSiteReadEnabled) return;

  const elements = root.querySelectorAll(
    'p, li, a, em, ul, ol, div, span, article, section'
  );
  
  elements.forEach((element) => {
    if (element.dataset.bionicProcessed === 'true') return;

    let didProcess = false;

    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
        didProcess = true;
        const text = cleanText(node.nodeValue);
        const processedText = splitSpaces(text)
          .map(keepSpacing)
          .map(processWord)
          .join('');

        // Pass chosenFont to styledSpan
        const span = styledSpan(processedText, chosenFont);

        span.dataset.bionicProcessed = 'true';
        node.replaceWith(span);
      }
    });

    if (didProcess) {
      element.dataset.bionicProcessed = 'true';
    }
  });

  spacingElementsList(root);
}


function toggleSiteRead() {
  if (isSiteReadEnabled) {
    getChosenFont((font) => {
      chosenFont = font;
      injectGoogleFonts();
      applySiteRead(document.body);
      observer = startObserver(applySiteRead);
    });
  } else {
    stopObserver(observer);
    location.reload(); // Reload page to reset DOM
  }
}


