// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  moduleNameMapper: {
    ".(css|less)$": "<rootDir>/assets/css/mocks/styleMock.js",
    //    "\\.(css|less)$": "<rootDir>/assets/css/mocks/styleMock.js",
  },
  testEnvironment: "jsdom",
  setupFiles: ["./test/setupTests.js"],
  reporters: ['default',
    ['jest-sonar', {
      outputDirectory: './coverage',
    }]],
};

module.exports = config;