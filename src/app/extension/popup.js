document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSiteRead');
  const fontSelect = document.getElementById('font-select');
  const previewText = document.getElementById('text');

  // Sync the toggle state with chrome.storage
  chrome.storage.sync.get(['siteReadEnabled'], (result) => {
    toggleSwitch.checked = result.siteReadEnabled || false;
    console.log('Initial toggle state:', toggleSwitch.checked);
  });

  // Toggle listener for Site Read on/off
  toggleSwitch.addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    chrome.storage.sync.set({ siteReadEnabled: isChecked });
    console.log('Updated toggle state:', isChecked);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) {
        console.error('No active tab found. Cannot send message.');
        return;
      }
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'toggleSiteRead', state: isChecked },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message:', chrome.runtime.lastError.message);
          } else {
            console.log('Message sent to content script:', response);
          }
        }
      );
    });
  });

  // Font selection handling
  // Load saved font from storage (default to "default" if not set)
  chrome.storage.sync.get(['chosenFont'], (res) => {
    if (res.chosenFont) {
      fontSelect.value = res.chosenFont;
      // Update preview text with chosen font; if "default", clear any override
      previewText.style.fontFamily = res.chosenFont === 'default' ? '' : res.chosenFont;
    }
  });

  // Listen for changes on the font dropdown
  fontSelect.addEventListener('change', (event) => {
    const selectedFont = event.target.value;
    // Save the chosen font in chrome.storage
    chrome.storage.sync.set({ chosenFont: selectedFont }, () => {
      console.log('Font selection saved:', selectedFont);
      // Update preview text to show the selected font immediately
      previewText.style.fontFamily = selectedFont === 'default' ? '' : selectedFont;
    });
  });
});
