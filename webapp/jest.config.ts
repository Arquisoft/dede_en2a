export default {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{tsx}"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testTimeout: 150000,
};
