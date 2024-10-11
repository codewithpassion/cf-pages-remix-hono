import type { Context } from 'hono';
import type { ContextEnv } from '.';
import { type PlatformProxy } from 'wrangler';

// When using `wrangler.toml` to configure bindings,
// `wrangler types` will generate types for those bindings
// into the global `Env` interface.



type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;

export function getLoadContext(c: Context<ContextEnv>) {
  const cloudflare = { env: c.env } as Cloudflare;

  return {
    cloudflare,
    // auth: c.get('auth'),
    // db: c.get('db'),
    // user: c.get('user'),
    // session: c.get('session'),
  };
}

declare module '@remix-run/cloudflare' {
  interface AppLoadContext extends ReturnType<typeof getLoadContext> { }
}