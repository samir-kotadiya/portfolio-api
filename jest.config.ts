export default {
  preset: 'ts-jest/presets/default-esm', // Use the ESM-specific preset
  testEnvironment: 'node',
  moduleNameMapper: {
    // This resolves the .js extension in your imports back to .ts files
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    // Ensure ts-jest is used for both .ts and .js files if needed
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true, // Enable ESM support in ts-jest
      },
    ],
  },
};
