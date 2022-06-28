import packageJson from "./package.json"
module.exports = {
    launch: {
        headless: true,
        slowMo: 300,
        args: [
            "--start-maximized",
            "no-sandbox",
            "disable-gpu",
            "enable-precise-memory-info",
            "js-flags=--expose-gc",
            "disable-dev-shm-usage",
            "--remote-debugging-port=9222"
        ],
        globals: {URL: packageJson.config.testURL
        },
    }
};
