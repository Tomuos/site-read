const fontApply = require("../fontApply/fontApply");
const fontReset = require("../fontReset/fontReset");
const fontLoadPreferences = require("../fontLoadPreference/fontLoadPreference");

function fontSelector() {
    if (document.getElementById("font-selector")) return; // Prevent duplicates

    const fontDropdown = document.createElement("select");
    fontDropdown.id = "font-selector";

    // ✅ Only include "Default" and "OpenDyslexic"
    const fontOptions = [
        "Default",  
        "OpenDyslexic"
    ];

    fontOptions.forEach(font => {
        const option = document.createElement("option");
        option.value = font;
        option.textContent = font;
        fontDropdown.appendChild(option);
    });

    fontDropdown.addEventListener("change", (event) => {
        const selectedFont = event.target.value;
        if (selectedFont === "Default") {
            fontReset();
        } else {
            fontApply(selectedFont);
            chrome.storage.sync.set({ preferredFont: selectedFont });
        }
    });

    document.body.appendChild(fontDropdown);
    fontLoadPreferences(); // ✅ Load saved font selection
}

module.exports = fontSelector;
