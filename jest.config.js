const config = {
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/', 'repo'],
  roots: ['.'],
  collectCoverageFrom: ['./**.js', '!./repo/**', '!./coverage/**'],
}

module.exports = config
