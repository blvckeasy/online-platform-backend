import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,   // 1 minutes
	limit: 100,                // Limit each IP to 20 requests per `window` (here, per 1 minutes).
})