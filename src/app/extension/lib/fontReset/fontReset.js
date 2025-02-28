function fontReset() {
    document.body.classList.remove("open-dyslexic"); // ✅ Remove CSS class
    document.body.style.fontFamily = ""; // Reset to default font
    chrome.storage.sync.remove("preferredFont"); // Remove saved font setting
}

module.exports = fontReset;
