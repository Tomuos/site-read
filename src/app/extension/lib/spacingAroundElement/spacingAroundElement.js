function spacingAroundElement(element) {
  const prevSibling = element.previousSibling;
  const nextSibling = element.nextSibling;

  // Ensure space before the element
  if (!prevSibling || prevSibling.nodeType !== Node.TEXT_NODE) {
    element.parentNode.insertBefore(document.createTextNode(' '), element);
  } else if (!prevSibling.nodeValue.endsWith(' ')) {
    prevSibling.nodeValue += ' ';
  }

  // Ensure space after the element
  if (!nextSibling || nextSibling.nodeType !== Node.TEXT_NODE) {
    element.parentNode.insertBefore(document.createTextNode(' '), nextSibling);
  } else if (!nextSibling.nodeValue.startsWith(' ')) {
    nextSibling.nodeValue = ' ' + nextSibling.nodeValue;
  }
}

module.exports = spacingAroundElement;
