function styledSpan(innerHTML) {
    const span = document.createElement('span');
    span.style.display = 'inline'; // Inline behavior
    span.style.whiteSpace = 'normal'; // Prevent text overflow
    span.style.fontSize = 'inherit'; // Inherit the font size from parent
    span.style.lineHeight = 'inherit'; // Inherit the line height
    span.innerHTML = innerHTML;
    return span;
  }
  
  module.exports = styledSpan;