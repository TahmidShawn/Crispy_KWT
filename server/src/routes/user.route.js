import { Router } from "express";
import {
    getAllCustomers,
    getMe,
    updatePassword,
} from "../controllers/user.controller.js";
import {
    isAuthenticatedUser,
    authorizeRoles,
} from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { updatePasswordSchema } from "../validations/user.validation.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();
router.route("/auth/me").get(isAuthenticatedUser, getMe);
router
    .route("/password/update")
    .put(
        authLimiter,
        isAuthenticatedUser,
        validateRequest(updatePasswordSchema),
        updatePassword,
    );
router
    .route("/admin/customers")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllCustomers);

export default router;
