import { resolve } from 'path';
import { defineConfig } from 'vite';
import sharedConfig from './../../shared/vite.config.shared';

export default defineConfig({
  ...sharedConfig,
  build: {
    ...sharedConfig.build,
    lib: {
      entry: {
        utilities: resolve(__dirname, 'src/index.ts'),
        accessibility: resolve(__dirname, 'src/accessibility/index.ts'),
        toggler: resolve(__dirname, 'src/toggler/index.ts'),
        selector: resolve(__dirname, 'src/selector/index.ts'),
        'dom-utilities': resolve(__dirname, 'src/dom-utilities/index.ts'),
        'scroll-to-top': resolve(__dirname, 'src/scroll-to-top.ts'),
        'dom-teleport': resolve(__dirname, 'src/dom-teleport.ts'),
      },
      name: '@flexilla/utilities',
      formats: ["es","cjs"]
    },
  },
});
