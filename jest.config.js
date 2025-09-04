// jest.config.js
export default {
  testEnvironment: 'jsdom', // Necesario para IntersectionObserver
  moduleFileExtensions: ['js', 'mjs'],
  transform: {
    '^.+\\.js$': 'babel-jest', // Transforma archivos .js con babel-jest
  },
};