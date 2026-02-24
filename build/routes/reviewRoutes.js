"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Endpoint para calificar el servicio y potencialmente banear la contraparte
router.post('/', authMiddleware_1.authenticateJWT, reviewController_1.postReview);
exports.default = router;
