require("dotenv").config();
const webpack = require("webpack");
const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  output: {
    path: path.resolve(__dirname, "./dist"),
  },
  devtool: "source-map",
  mode: "production",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.APP_HOST": JSON.stringify(process.env.APP_PROD_HOST),
    }),
  ],
});
