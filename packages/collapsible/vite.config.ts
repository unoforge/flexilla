import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import sharedConfig from './../../shared/vite.config.shared';

export default defineConfig({
  ...sharedConfig,
  plugins: [
    dts({
      rollupTypes: true,
      insertTypesEntry: true,
      include: ['src']
    })
  ],
  build: {
    ...sharedConfig.build,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@flexilla/collapsible',
      fileName: 'collapsible',
    },
  },
});
