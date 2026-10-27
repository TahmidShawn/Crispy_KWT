import { Router } from "express";

import {
    createCake,
    getCakes,
    getAdminCakes,
    getAdminCake,
    getCake,
    updateCake,
    deleteCake,
    updateCakeOrder,
} from "../controllers/cake.controller.js";

import {
    isAuthenticatedUser,
    authorizeRoles,
} from "../middlewares/auth.middleware.js";

import { validateRequest } from "../middlewares/validation.middleware.js";

import {
    createCakeSchema,
    updateCakeSchema,
} from "../validations/cake.validation.js";

import upload from "../middlewares/multer.middleware.js";

const router = Router();
router.route("/cakes").get(getCakes);
router.route("/cakes/:slug").get(getCake);
router
    .route("/admin/cakes")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminCakes)
    .post(
        isAuthenticatedUser,
        authorizeRoles("admin"),
        upload.array("images"),
        validateRequest(createCakeSchema),
        createCake,
    );
router
    .route("/admin/cakes/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminCake)
    .put(
        isAuthenticatedUser,
        authorizeRoles("admin"),
        upload.array("images"),
        validateRequest(updateCakeSchema),
        updateCake,
    )
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCake);

router
    .route("/admin/cakes/reorder")
    .patch(isAuthenticatedUser, authorizeRoles("admin"), updateCakeOrder);

export default router;
