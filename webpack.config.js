const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { ModuleFederationPlugin } = require('webpack').container;
const dependencies = require("./package.json").dependencies;

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),  // Save bundled files in a 'dist' directory
    filename: "[name].bundle.js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
  devServer: {
    port: 3008,
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    liveReload: true,
    historyApiFallback: true,
  },
  name: "task-nav",
  module: {
    rules: [
      {
        test: /\.tsx?$/,  // For both .ts and .tsx files
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/, // Handle CSS files
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
    }),
    new MiniCssExtractPlugin(),
    new ModuleFederationPlugin({
      name: "task",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./TopNav": "./src/App.tsx",
        "./AdminDashboard": "./src/pages/AdminDashboard.tsx",
        "./UserDashboard": "./src/pages/UserDashboard.tsx"
      },
      shared: {
        "react": {
          singleton: true,
          requiredVersion: dependencies.react
        },
        "react-dom": {
          singleton: true,
          requiredVersion: dependencies["react-dom"]
        },
        "@mui/material": {
          singleton: true,
          requiredVersion: dependencies["@mui/material"]
        },
        "@mui/icons-material": {
          singleton: true,
          requiredVersion: dependencies["@mui/icons-material"]
        },
      }
    })
  ],
};
