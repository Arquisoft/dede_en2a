export default {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  collectCoverage: true,
  collectCoverageFrom: ["**/*.tsx"],
  testTimeout: 150000,
};
