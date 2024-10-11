import { createFactory } from 'hono/factory';
import type { ContextEnv } from 'server';

export const factory = createFactory<ContextEnv>();