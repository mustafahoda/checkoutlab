const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./public/index.html",
});

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
        resolve: {
          extensions: [".ts", ".tsx", ".js", ".json"],
        },
      },
    ],
  },

  node: {
    fs: "empty",
  },

  // Telling webpack which extensions
  // we are interested in.
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },

  // What file name should be used for the result file,
  // and where it should be palced.
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  // Use the html plugin.
  plugins: [htmlPlugin],
};
