https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/config/webpack.config.js

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const webpack = require("webpack");
const paths = require("./path");
const getClientEnvironment = require("./end");

const BabelOption = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: { version: "3.8", proposals: true },
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: ["@babel/plugin-transform-runtime"],
  babelrc: false,
  configFile: false,
  cacheDirectory: true,
};

module.exports = (_, argv) => {
  const isEnvDevelopment = argv.mode === "development";
  const isEnvProduction = argv.mode === "production";

  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
  return {
    mode: isEnvDevelopment ? "development" : isEnvProduction && "production",
    entry: paths.appIndexJs,
    output: {
      filename:
        "static/js/" + isEnvProduction
          ? "[name].[contenthash:8].js"
          : "bundle.js",
      chunkFilename:
        "static/js/" + isEnvProduction
          ? "[name].[contenthash:8].chunk.js"
          : "[name].chunk.js",
      path: paths.appBuild,
      publicPath: paths.publicUrlOrPath,
    },
    resolve: {
      modules: ["node_modules", paths.appNodeModules],
      extensions: paths.moduleFileExtensions.map((ext) => `.${ext}`),
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: paths.appSrc,
          use: [
            {
              loader: "babel-loader",
              options: BabelOption,
            },
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          loader: "file-loader",
          options: {
            name: "static/media/[name].[hash].[ext]",
          },
        },
        {
          test: /\.css$/,
          use: [
            isEnvDevelopment && "style-loader",
            isEnvProduction && MiniCssExtractPlugin.loader,
            "css-loader",
          ].filter(Boolean),
        },
      ],
    },

    optimization: {
      minimize: isEnvProduction,
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: paths.appHtml,
        favicon: paths.appFavicon,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
        },
      }),
      new ForkTsCheckerWebpackPlugin({
        async: isEnvDevelopment,
      }),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          filename: "static/css/[name].[contenthash:8].css",
          chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
      new webpack.DefinePlugin(env.stringified),
      new webpack.HotModuleReplacementPlugin(),
    ].filter(Boolean),
    devtool: isEnvProduction ? "cheap-module-source-map" : "inline-source-map",
    devServer: {
      static: {
        directory: paths.appPublic,
        publicPath: [paths.publicUrlOrPath],
      },
      client: { overlay: true },
      historyApiFallback: true,
      port: "3000",
      hot: true,
    },
  };
};
