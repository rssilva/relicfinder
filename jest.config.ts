const config = {
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/', 'repo'],
  roots: ['.'],
  collectCoverageFrom: [
    './src/**/**.*',
    '!./repo/**',
    '!./coverage/**',
    '!./test/**',
    '!jest.config.ts',
  ],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
}

export default config
