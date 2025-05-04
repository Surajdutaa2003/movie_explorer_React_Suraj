import type * as jest from 'jest';

type Config = jest.Config;

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpe?g|gif)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // Add transformIgnorePatterns for ignoring modules during transformation
  transformIgnorePatterns: ['/node_modules/(?!swiper)/'], // This line handles ignoring swiper module
  testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Path ignoring remains unchanged
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'withNavigate.tsx',
    'main.tsx',
    'swiper-css.d.ts',
    'vite-env.d.ts',
    'custom.d.ts'
  ],

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};

export default config;
