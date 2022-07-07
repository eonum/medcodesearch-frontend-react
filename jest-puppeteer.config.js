// TODO: Somehow window-size has no affect, not sure why
module.exports = {
    launch: {
        dumpio: true,
        headless: true,
        slowMo: 300,
        args: [
            "--disable-software-rasterizer",
            "--disable-infobars",
            "--no-sandbox",
            "--disable-gpu",
            "--enable-precise-memory-info",
            "--disable-dev-shm-usage",
        ],
    },
    server: {
        command: "npm run startHeadlessOnTestPort",
    },
    browserContext: 'default',
};
