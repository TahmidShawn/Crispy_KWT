import { Router } from "express";
import {
    registerUser,
    loginUser,
    googleLogin,
    logout,
    verifyEmail,
    resendVerification,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
} from "../controllers/auth.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verificationSchema,
} from "../validations/user.validation.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();
router
    .route("/auth/register")
    .post(authLimiter, validateRequest(registerSchema), registerUser);
router
    .route("/auth/login")
    .post(authLimiter, validateRequest(loginSchema), loginUser);
router.route("/auth/google").post(googleLogin);
router.route("/auth/refresh-token").post(authLimiter, refreshAccessToken);
router
    .route("/auth/verify-email")
    .post(authLimiter, validateRequest(verificationSchema), verifyEmail);
router
    .route("/auth/resend-verification")
    .post(
        authLimiter,
        validateRequest(forgotPasswordSchema),
        resendVerification,
    );
router
    .route("/password/forgot")
    .post(authLimiter, validateRequest(forgotPasswordSchema), forgotPassword);
router
    .route("/password/reset/:token")
    .put(authLimiter, validateRequest(resetPasswordSchema), resetPassword);
router.route("/auth/logout").post(isAuthenticatedUser, logout);

export default router;
