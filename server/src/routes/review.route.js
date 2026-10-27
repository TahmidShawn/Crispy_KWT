import { Router } from "express";

import {
    getCakeReviews,
    getMyCakeReview,
    createReview,
    deleteReview,
    getAdminReviews,
    getLatestReviews,
} from "../controllers/review.controller.js";
import {
    isAuthenticatedUser,
    authorizeRoles,
} from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { createReviewSchema } from "../validations/review.validation.js";
import { reviewLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();
router.route("/reviews/latest").get(getLatestReviews);
router.route("/cakes/:slug/reviews").get(getCakeReviews);
router
    .route("/cakes/:slug/reviews/me")
    .get(isAuthenticatedUser, getMyCakeReview);
router
    .route("/cakes/:slug/reviews")
    .post(
        isAuthenticatedUser,
        reviewLimiter,
        validateRequest(createReviewSchema),
        createReview,
    );
router
    .route("/reviews/:id")
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);
router
    .route("/admin/reviews")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminReviews);

router
    .route("/admin/reviews/:id")
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

export default router;
