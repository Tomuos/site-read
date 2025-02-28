const fontApply = require("./fontApply");
const fontReset = require("./fontReset");

function fontLoadPreferences() {
    chrome.storage.sync.get(["preferredFont"], (result) => {
        const savedFont = result.preferredFont;
        if (!savedFont || savedFont === "Default") {
            fontReset();  // Reset font if "Default" is selected
        } else {
            fontApply(savedFont);
        }

        const dropdown = document.getElementById("font-selector");
        if (dropdown) dropdown.value = savedFont || "Default";
    });
}

module.exports = fontLoadPreferences;
