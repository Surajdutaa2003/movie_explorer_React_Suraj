import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^swiper/react$': '<rootDir>/src/__mocks__/swiperMock.js',
    '^swiper/modules$': '<rootDir>/src/__mocks__/swiperMock.js',
    '^swiper/css(.*)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transformIgnorePatterns: [
    '/node_modules/(?!(swiper|ssr-window|dom7)/)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};

export default config;