import packageJson from "./package.json"

module.exports = {
    preset: "jest-puppeteer",
    globals: {
        URL: packageJson.config.testURL
    }
};
