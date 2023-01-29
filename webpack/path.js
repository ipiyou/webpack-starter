// https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/config/paths.js
"use strict";

const path = require("path");
const fs = require("fs");
const getPublicUrlOrPath = require("./getPublicUrlOrPath");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === "development",
  require(resolveApp("package.json")).homepage,
  process.env.PUBLIC_URL
);

const buildPath = process.env.BUILD_PATH || "build";

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx",
];

const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

module.exports = {
  appBuild: resolveApp(buildPath),
  appPublic: resolveApp("public"),
  appFavicon: resolveApp("public/favicon.ico"),
  appHtml: resolveApp("public/index.html"),
  appIndexJs: resolveModule(resolveApp, "src/index"),
  appSrc: resolveApp("src"),
  appNodeModules: resolveApp("node_modules"),
  publicUrlOrPath,
  moduleFileExtensions,
};
