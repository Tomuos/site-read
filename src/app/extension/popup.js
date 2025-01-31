document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSiteRead');

  // Sync the toggle state with chrome.storage
  chrome.storage.sync.get(['siteReadEnabled'], (result) => {
    toggleSwitch.checked = result.siteReadEnabled || false;
    console.log('Initial toggle state:', toggleSwitch.checked);
  });

  // Toggle listener
  toggleSwitch.addEventListener('change', (event) => {
    const isChecked = event.target.checked;

    // Update state in storage
    chrome.storage.sync.set({ siteReadEnabled: isChecked });
    console.log('Updated toggle state:', isChecked);

    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) {
        console.error('No active tab found. Cannot send message.');
        return;
      }
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSiteRead', state: isChecked }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError.message);
        } else {
          console.log('Message sent to content script:', response);
        }
      });
    });
  });
});
