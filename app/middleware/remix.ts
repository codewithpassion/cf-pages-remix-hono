import { type ServerBuild, createRequestHandler } from '@remix-run/cloudflare';
import { factory } from 'server/factory';
import { getLoadContext } from 'server/load-context';

export const remix = factory.createMiddleware(async c => {
    const build = (await (process.env.NODE_ENV === 'development'
        ? import('virtual:remix/server-build' as never)
        : import('build/server' as never))) as ServerBuild;

    const requestHandler = createRequestHandler(build, process.env.NODE_ENV);

    return await requestHandler(c.req.raw, getLoadContext(c));
});