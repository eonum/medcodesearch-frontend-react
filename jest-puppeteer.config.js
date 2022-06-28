// TODO: Somehow window-size has no affect, not sure why
module.exports = {
    launch: {
        headless: true,
        slowMo: 300,
        args: [
            "no-sandbox",
            "disable-gpu",
            "enable-precise-memory-info",
            "js-flags=--expose-gc",
            "disable-dev-shm-usage",
            "--remote-debugging-port=9222",
            `--window-size=1920,1080`
        ]
    }
};
