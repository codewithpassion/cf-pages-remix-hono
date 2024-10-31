import { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { ContextEnv } from "server";

const envDefaultsMiddleware = createMiddleware(async (c: Context<ContextEnv>, next) => {
    c.env.AUTH_API_SERVER = c.env.AUTH_API_SERVER || "https://api.heimdall.rockyshoreslabs.io/";
    const origin = c.req.header('origin');
    if (!origin) { console.error("No origin header found in request") }
    c.set('serverUrl', origin || '');
    await next()
});

export { envDefaultsMiddleware }