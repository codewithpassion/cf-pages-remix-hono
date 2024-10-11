import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
// import type { Session, User } from 'lucia';
import { staticAssets } from 'remix-hono/cloudflare';
import { trailingSlash } from 'remix-hono/trailing-slash';
import { factory } from './factory';

// import { auth } from '~/middleware/auth';
// import { db } from '~/middleware/db';
import { remix } from '~/middleware/remix';
// import { validateRequest } from '~/middleware/validate-request';

export type ContextEnv = {
    Bindings: Required<Env>;
    Variables: {
        // user: User | null;
        // session: Session | null;
    };
};

const app = factory.createApp();

app.use(csrf());
app.use(logger());
app.use(prettyJSON({ space: 4 }));
app.use(secureHeaders());
app.use(trailingSlash());

app.get('/api', (c) => {
    return c.json({ message: 'Hello, World!' });
});

// app.use(db);
// app.use(auth);
// app.use(validateRequest);

app.use('/api/*', cors());

app.use(
    async (c, next) => {
        if (process.env.NODE_ENV !== 'development') {
            return staticAssets()(c, next);
        }
        await next();
    },

    remix,
);

showRoutes(app);

export default app;