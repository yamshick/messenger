require("dotenv").config();
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { modules: true } },
        ],
      },
      {
        test: /\.style$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.mp3$/,
        // include: SRC,
        loader: "file-loader",
      },
    ],
  },
  resolve: {
    modules: ["frontend", "src", "node_modules"],
    extensions: [".js", ".jsx"],
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env.APP_HOST':
    //   ? JSON.stringify(process.env.APP_PROD_HOST)
    //   : JSON.stringify(process.env.APP_DEV_HOST)
    // }),
    new webpack.DefinePlugin({
      "process.env.SOCKET_PORT": JSON.stringify(process.env.SOCKET_PORT),
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
