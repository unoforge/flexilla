/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // Use jsdom for DOM-like environment
    setupFiles: [], // Optional: if you need setup files
    include: ['src/**/*.test.{ts,tsx}'], // Pattern to find test files
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
    },
  },
});
