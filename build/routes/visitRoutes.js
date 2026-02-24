"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const visitController_1 = require("../controllers/visitController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Endpoint para que un profesional ofrezca una visita técnica (fijando precio)
router.post('/offer', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.requireRole)('professional'), visitController_1.offerVisit);
// Endpoint para que el cliente acepte la visita y pague (retiene en Escrow)
router.post('/accept', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.requireRole)('client'), visitController_1.acceptVisitAndPay);
exports.default = router;
