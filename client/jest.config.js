// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  moduleNameMapper: {
    ".(css|less)$": "<rootDir>/src/mocks/styleMock.js",
    ".(png)$": "<rootDir>/src/mocks/pngMock.js",
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