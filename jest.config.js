module.exports = {
    testTimeout: 30000,
    testMatch: ['**/?(*.)+(spec|test).[t]s[x]'],
    preset: 'jest-puppeteer',
    transform: {
        '^.+\\.tsx$': 'babel-jest',
    },
    testPathIgnorePatterns: ['/node_modules/'],
};
