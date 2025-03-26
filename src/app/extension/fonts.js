
function injectGoogleFonts() {
    // Avoid injecting multiple times
    if (document.getElementById('myBionicFontsLink')) return;
  
    const link = document.createElement('link');
    link.id = 'myBionicFontsLink';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap';
    document.head.appendChild(link);
  }
  
  /**
   * Get the chosen font from chrome.storage (default to Open Sans if none).
   * This is asynchronous, so we provide a callback or return a Promise.
   */
  function getChosenFont(callback) {
    chrome.storage.sync.get(['chosenFont'], (res) => {
      const font = res.chosenFont || '"Open Sans", sans-serif';
      callback(font);
    });
  }
  
  module.exports = {
    injectGoogleFonts,
    getChosenFont
  };
  