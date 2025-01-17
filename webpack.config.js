
const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    // Replace with the path to your main content script
    contentScript: './src/app/extension/contentScript.js'
  },
  output: {
    // This will create a "dist" folder inside your project
    path: path.resolve(__dirname, 'dist'),
    // Name it "contentScript.bundle.js" automatically
    filename: '[name].bundle.js'
  }
};
