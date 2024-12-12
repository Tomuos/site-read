function cleanText(text) {
return text.replace(/\s+/g, ' ').trim();
}

module.exports = cleanText;