const spacingAroundElement = require('../spacingAroundElement/spacingAroundElement')

function spacingElementsList(root){
    const anchorElement = root.querySelectorAll('a');
    const italicElement = root.querySelectorAll('em');
    // const strongElement = root.querySelectorAll('strong');
    const spanElement = root.querySelectorAll('span');


    anchorElement.forEach(element => spacingAroundElement(element));
    italicElement.forEach(element => spacingAroundElement(element));
    // strongElement.forEach(element => spacingAroundElement(element));
    spanElement.forEach(element => spacingAroundElement(element));

}

module.exports = spacingElementsList;