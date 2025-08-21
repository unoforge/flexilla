import { resolve } from 'path';
import { defineConfig } from 'vite';
import sharedConfig from './../../shared/vite.config.shared';

export default defineConfig({
  ...sharedConfig,
  build: {
    ...sharedConfig.build,
    lib: {
      entry: {
        flexipop: resolve(__dirname, 'src/index.ts'),
        'create-overlay': resolve(__dirname, 'src/create-overlay/index.ts'),
      },
      name: 'flexipop',
    },
    rollupOptions: {
      output: {
        assetFileNames: "flexipop.[ext]"
      }
    }
  }
});
