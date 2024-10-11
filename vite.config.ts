import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import devServer, { defaultOptions } from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'

export default defineConfig({
  ssr: {
    resolve: {
      externalConditions: ['workerd', 'worker']
    }
  },
  plugins: [
    // remixCloudflareDevProxy(),
    // viteWranglerSpa({
    //   functionEntrypoint: 'functions/_server.ts',
    //   allowedApiPaths: ['^/api/*'],
    // }),

    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,

      },
    }),
    devServer({
      adapter,
      entry: 'server/index.ts',
      exclude: [...defaultOptions.exclude, '/assets/**', '/app/**'],
      injectClientScript: false
    }),
    tsconfigPaths(),
  ],
});
