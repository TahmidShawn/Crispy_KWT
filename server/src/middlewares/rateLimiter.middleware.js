import rateLimit from "express-rate-limit";
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 200, // 200 requests per ip per window
    message: {
        success: false,
        message: "Too many requests from this IP. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: {
        success: false,
        message: "Too many attempts. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const webhookLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5, // 5 webhook attempts per IP per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many webhook attempts. Please try again later.",
    },
});
export const reviewLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 10, // 10 review writes per IP per 10 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many review attempts. Please try again later.",
    },
});
export const orderLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 8, // 8 orders per IP per 10 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many orders from this IP. Please try again later.",
    },
});
