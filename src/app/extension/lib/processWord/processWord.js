const keepSpacing = require('../keepSpacing/keepSpacing')

function processWord(word) {

    const cleanWord = keepSpacing(word); 
    
    if (cleanWord.length === 1) {
        return `<strong>${word}</strong>`
    }
    else if (cleanWord.length === 2 ){
        return `<strong>${word.charAt(0)}</strong>${word.charAt(1)}`;
    }
    else if (cleanWord.length === 3){
        return `<strong>${word.substring(0, 2)}</strong>${word.charAt(2)}`
    }
    else if (cleanWord.length > 3){
        const boldMath = Math.ceil(cleanWord.length / 2);
        return `<strong>${word.substring(0, boldMath)}</strong>${word.substring(boldMath)}`
    }
    
    return word;

}

module.exports = processWord;