// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  moduleNameMapper: {
    ".(css|less)$": "<rootDir>/assets/css/mocks/styleMock.js",
    //    "\\.(css|less)$": "<rootDir>/assets/css/mocks/styleMock.js",
  },
  testEnvironment: "jsdom",
};

module.exports = config;
