module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    transformIgnorePatterns: [
        '/node_modules/(?!axios)',
    ],

    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        'src/**/*.tsx',
        '!src/**/*.d.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
};
