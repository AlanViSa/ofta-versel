module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js',
    '^axios$': require.resolve('axios')
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.js' }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(axios)/)'
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  testTimeout: 30000,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  },
  globals: {
    TextEncoder: require('util').TextEncoder,
    TextDecoder: require('util').TextDecoder
  },
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  projects: [
    {
      displayName: 'components',
      testMatch: ['<rootDir>/src/components/**/*.test.{js,jsx,ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
      testEnvironmentOptions: {
        url: 'http://localhost'
      }
    },
    {
      displayName: 'server',
      testMatch: [
        '<rootDir>/src/controllers/**/*.test.{js,jsx,ts,tsx}',
        '<rootDir>/src/middleware/**/*.test.{js,jsx,ts,tsx}',
        '<rootDir>/src/services/**/*.test.{js,jsx,ts,tsx}',
        '<rootDir>/src/utils/**/*.test.{js,jsx,ts,tsx}'
      ],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
      testEnvironmentOptions: {
        NODE_ENV: 'test',
        TEST_ENV: 'server'
      }
    }
  ]
}; 