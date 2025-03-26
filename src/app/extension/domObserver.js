function startObserver(callback) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              callback(node);
            }
          });
        }
        if (mutation.type === 'characterData') {
          const parent = mutation.target.parentNode;
          if (parent) {
            callback(parent);
          }
        }
      });
    });
  
    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  
    return observer;
  }
  
  function stopObserver(observer) {
    if (observer) {
      observer.disconnect();
    }
  }
  
  module.exports = { startObserver, stopObserver };