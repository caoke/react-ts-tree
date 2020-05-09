// jest.config.js
module.exports = {
  roots: ['./src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '^.+\\.test\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: [
    './_test_/test.setup.js',
    './_test_/test.shim.js'
  ],
  moduleNameMapper: {
    "\\.(css|scss)": "identity-obj-proxy"
  },
  setupFilesAfterEnv: [
    "./_test_/setuptests.ts"
  ]
};