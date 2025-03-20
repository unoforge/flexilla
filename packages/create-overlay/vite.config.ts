import { resolve } from 'path';
import { defineConfig } from 'vite';
import sharedConfig from '../../shared/vite.config.shared';

export default defineConfig({
  ...sharedConfig,
  build: {
    ...sharedConfig.build,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@flexilla/create-overlay',
      fileName: 'create-overlay',
    },
    rollupOptions: {
      output: {
        assetFileNames: "create-overlay.[ext]"
      }
    }
  },
});
