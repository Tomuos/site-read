const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    contentScript: './src/app/extension/contentScript.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  }
};