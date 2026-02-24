"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentMPController_1 = require("../controllers/paymentMPController");
const router = (0, express_1.Router)();
// /api/payments/create-preference
router.post('/create-preference', paymentMPController_1.createPreference);
// /api/webhooks/mercadopago
router.post('/mercadopago', paymentMPController_1.mpWebhookHandler);
exports.default = router;
