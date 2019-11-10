module.exports = {
    setupFilesAfterEnv: ['./jest.setup.js'],
    moduleNameMapper: {
        "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js"
    }
}