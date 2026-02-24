"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// El profesional envía el costo de Mano de Obra + Materiales
router.post('/quote/final', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.requireRole)('professional'), paymentController_1.sendFinalQuote);
// El cliente acepta la cotización final y los fondos se bloquean en Escrow
router.post('/quote/accept', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.requireRole)('client'), paymentController_1.acceptFinalQuoteAndPay);
// El cliente da el OK final y se libera el dinero del Escrow al Profesional
router.post('/release', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.requireRole)('client'), paymentController_1.approveJobCompletion);
exports.default = router;
