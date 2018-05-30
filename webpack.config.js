const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

// ========================================================================
// PROJECT CONFIG
const appName = "timeline"; // Webpack will build two files with the appName.

// ========================================================================
// TEMPLATE MAPPING

// For local development/server testing
const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

// For sharepoint
const txtPlugin = new HtmlWebPackPlugin({
  template: "./src/index.txt",
  filename: appName + ".txt"
});

module.exports = {
  entry: {
    main: "./src/index.js"
  },
  output: {
    filename: appName + ".js",
    path: path.resolve("./dist")
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    }]
  },
  plugins: [htmlPlugin, txtPlugin]
};
