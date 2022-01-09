// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  moduleNameMapper: {
    ".(css|less)$": "<rootDir>/assets/css/mocks/styleMock.js",
    ".(png)$": "<rootDir>/assets/css/mocks/pngMock.js",
  },
  testEnvironment: "jsdom",
  setupFiles: ["./test/setupTests.js"],
  setupFilesAfterEnv: ["./test/setupAfterEnv.js"],
  reporters: ['default',
    ['jest-sonar', {
      outputDirectory: './coverage',
    }]],
};

module.exports = config;