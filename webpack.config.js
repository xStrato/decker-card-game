const path = require("path");

module.exports = {
  entry: "./build/src/index.js",
  devtool: 'inline-source-map',
  output: {
    filename: "./bundle.js",
    path: path.resolve(__dirname, "build")
  },
  devServer: {
    contentBase: "./build"
  }
};