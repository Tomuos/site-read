const cleanText = require('./lib/cleanText/cleanText');
const keepSpacing = require('./lib/keepSpacing/keepSpacing');
const splitSpaces = require('./lib/removeExtraWhitespace/splitSpaces');
const processWord = require('./lib/processWord/processWord')


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
  if (!isSiteReadEnabled) return; // Exit if the effect is toggled off

  // Select paragraphs, list items, articles, divs, and links
  const elements = document.querySelectorAll('p, li, ol, article, div, a, em');

  elements.forEach((element) => {
    element.childNodes.forEach((node) => {
      // Only process text nodes (ignore elements like <strong>, <a>, <em>, etc.)
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.nodeValue;

        // Clean the text by removing excessive whitespace but preserving spaces
        text = cleanText(text)
        
        const words = splitSpaces(text); 

        

        const siteReadText = words.map((word) => {
          const cleanWord = keepSpacing(word); 
          return processWord(cleanWord);       
        }).join('');
        
        
        const span = document.createElement('span');
        span.innerHTML = siteReadText;
        node.replaceWith(span);
      }
    });

    if (element.tagName === 'A' || element.tagName === 'EM') {
      const prevSibling = element.previousSibling;
      const nextSibling = element.nextSibling;
    

      if (element.tagName === 'A') {
        // Ensure space before the link
        if (!element.previousSibling || element.previousSibling.nodeType !== Node.TEXT_NODE) {
          element.parentNode.insertBefore(document.createTextNode(' '), element);
        } else if (!element.previousSibling.nodeValue.endsWith(' ')) {
          element.previousSibling.nodeValue += ' ';
        }
      
        // Ensure space after the link
        if (!element.nextSibling || element.nextSibling.nodeType !== Node.TEXT_NODE) {
          element.parentNode.insertBefore(document.createTextNode(' '), element.nextSibling);
        } else if (!element.nextSibling.nodeValue.startsWith(' ')) {
          element.nextSibling.nodeValue = ' ' + element.nextSibling.nodeValue;
        }
      }


      // Ensure space before the element
      if (!prevSibling || prevSibling.nodeType !== Node.TEXT_NODE) {
        element.parentNode.insertBefore(document.createTextNode(' '), element);
      } else if (!prevSibling.nodeValue.endsWith(' ')) {
        prevSibling.nodeValue += ' ';
      }
    
      // Ensure space after the element
      if (!nextSibling || nextSibling.nodeType !== Node.TEXT_NODE) {
        element.parentNode.insertBefore(document.createTextNode(' '), element.nextSibling);
      } else if (!nextSibling.nodeValue.startsWith(' ')) {
        nextSibling.nodeValue = ' ' + nextSibling.nodeValue;
      }


    }
  });
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
  }
}

// Reapply site read when DOM changes (for dynamic pages)
const observer = new MutationObserver(() => {
  if (isSiteReadEnabled) applySiteRead(); // Reapply the site read effect on DOM changes
});

// Initial call to apply site read on page load
applySiteRead();
