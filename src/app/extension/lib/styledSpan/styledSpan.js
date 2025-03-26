// styledSpan.js

function styledSpan(innerHTML, fontFamily = '"Open Sans", sans-serif') {
  const span = document.createElement('span');
  span.style.display = 'inline';
  span.style.whiteSpace = 'normal';
  span.style.fontSize = 'inherit';
  span.style.lineHeight = 'inherit';

  // If the user chose a specific font, apply it
  span.style.fontFamily = fontFamily;

  span.innerHTML = innerHTML;
  return span;
}

module.exports = styledSpan;
