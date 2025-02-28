function fontApply(fontName) {
    if (fontName === "OpenDyslexic") {
        document.body.classList.add("open-dyslexic"); // ✅ Add CSS class
    } else {
        document.body.classList.remove("open-dyslexic");
    }

    // Force refresh to ensure font loads properly
    document.body.style.display = "none";
    requestAnimationFrame(() => {
        document.body.style.display = "";
    });
}

module.exports = fontApply;
