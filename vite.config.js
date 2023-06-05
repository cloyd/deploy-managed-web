import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import * as esbuild from 'esbuild';
import fs from 'node:fs';

const __dirname = path.resolve();

// const sourceJSPattern = /\/src\/.*\.js$/;
// const nodeModulesJSPattern = /\/node_modules\/.*\.js$/;

const rollupPlugin = (matchers) => ({
  name: 'js-in-jsx',
  load(id) {
    if (matchers.some((matcher) => matcher.test(id))) {
      const file = fs.readFileSync(id, { encoding: 'utf-8' });
      return esbuild.transformSync(file, { loader: 'jsx' });
    }
  },
});
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'MANAGED_APP_');

  return {
    envPrefix: 'MANAGED_APP_',
    resolve: {
      alias: {
        // eslint-disable-next-line no-undef
        '@app': path.resolve(__dirname, './src/old'),
      },
    },
    plugins: [react()],
    server: {
      open: true,
      port: 3001,
      proxy: {
        '/api': {
          target: env.MANAGED_APP_API_URL || 'http://localhost:3000/api',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    preview: {
      port: 8080,
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    build: {
      rollupOptions: {
        plugins: [rollupPlugin([/\/src\/.*\.js$/])],
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },

    esbuild: {
      loader: 'jsx',
      include: [
        // Business as usual for .jsx and .tsx files
        'src/**/*.jsx',
        'node_modules/**/*.jsx',

        // Add the specific files you want to allow JSX syntax in
        'node_modules/preact-css-transition-group/src/CSSTransitionGroup.js',
      ],
    },
  };
});
