// import type * as jest from 'jest';

// type Config = jest.Config;

// const config: Config = {
//   preset: 'ts-jest', // Use ts-jest preset
//   testEnvironment: 'jsdom',
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/src/$1', // Support tsconfig paths
//     '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
//     '\\.(png|jpe?g|gif)$': '<rootDir>/src/__mocks__/fileMock.js',
//   },
//   setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
//   transformIgnorePatterns: ['/node_modules/(?!swiper|react-router-dom)/'],
//   testPathIgnorePatterns: ['/node_modules/', '/dist/'],
//   collectCoverageFrom: ['src/**/*.{ts,tsx}'],
//   coveragePathIgnorePatterns: [
//     '/node_modules/',
//     'withNavigate.tsx',
//     'main.tsx',
//     'swiper-css.d.ts',
//     'vite-env.d.ts',
//     'custom.d.ts',
//   ],
//   coverageThreshold: {
//     global: {
//       branches: 80,
//       functions: 80,
//       lines: 80,
//       statements: 80,
//     },
//   },
//   verbose: true, // Optional for debugging
// };

// export default config;


// import type { Config } from "jest";

// const config: Config = {
//   preset: "ts-jest",
//   testEnvironment: "jsdom", // Ensure this is correctly set
//   setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

//   moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
//   moduleNameMapper: {
//     "\\.(css|scss)$": "identity-obj-proxy", 
//     "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/__mocks__/fileMock.ts"
//   },
//   transform: {
//     "^.+\\.(ts|tsx)$": "ts-jest"
//   },
   
// };

// export default config;


import type * as jest from 'jest';

type Config = jest.Config;

const config: Config = {
  preset: 'ts-jest', // Use ts-jest preset
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Support tsconfig paths
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpe?g|gif)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transformIgnorePatterns: ['/node_modules/(?!swiper|react-router-dom)/'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'withNavigate.tsx',
    'main.tsx',
    'swiper-css.d.ts',
    'vite-env.d.ts',
    'custom.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  verbose: true, // Optional for debugging
};

export default config;