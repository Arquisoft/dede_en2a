export default {
  rootDir: "./../",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/env.js"],
  collectCoverage: true,
  collectCoverageFrom: ["api.ts"],
  testTimeout: 15000,
};
