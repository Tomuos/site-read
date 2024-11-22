document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSiteRead');

  // Check the initial state from chrome.storage and set the toggle state
  chrome.storage.sync.get(['siteReadEnabled'], (result) => {
    toggleSwitch.checked = result.siteReadEnabled || false;
  });

  toggleSwitch.addEventListener('change', (event) => {
    const isChecked = event.target.checked;

    // Save the state in chrome.storage
    chrome.storage.sync.set({ siteReadEnabled: isChecked });

    // Send a message to the content script to toggle SiteRead
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSiteRead', state: isChecked });
    });
  });
});
