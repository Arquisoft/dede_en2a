export default {
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testMatch: ["**/steps/*.ts"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    preset: "jest-puppeteer",
}