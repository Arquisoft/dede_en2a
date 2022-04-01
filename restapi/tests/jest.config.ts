export default {
  rootDir: "./../",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  collectCoverage: true,
  collectCoverageFrom: ["**/*Controller.ts"],
  testTimeout: 15000,
};
