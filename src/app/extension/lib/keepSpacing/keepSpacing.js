// const cleanWord = word.replace(/[^\w\s]/g, '');

function keepSpacing(word) {
    return word.replace(/[^\w\s]/g, '')
} 

module.exports = keepSpacing;