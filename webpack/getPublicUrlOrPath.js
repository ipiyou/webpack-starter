// https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/getPublicUrlOrPath.js#L48
"use strict";

const { URL } = require("url");

function getPublicUrlOrPath(isEnvDevelopment, homepage, envPublicUrl) {
  const stubDomain = "https://localhost:3000";

  if (envPublicUrl) {
    envPublicUrl = envPublicUrl.endsWith("/")
      ? envPublicUrl
      : envPublicUrl + "/";

    const validPublicUrl = new URL(envPublicUrl, stubDomain);

    return isEnvDevelopment
      ? envPublicUrl.startsWith(".")
        ? "/"
        : validPublicUrl.pathname
      : envPublicUrl;
  }

  if (homepage) {
    homepage = homepage.endsWith("/") ? homepage : homepage + "/";

    const validHomepagePathname = new URL(homepage, stubDomain).pathname;
    return isEnvDevelopment
      ? homepage.startsWith(".")
        ? "/"
        : validHomepagePathname
      : homepage.startsWith(".")
      ? homepage
      : validHomepagePathname;
  }

  return "/";
}

module.exports = getPublicUrlOrPath;
