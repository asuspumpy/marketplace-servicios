"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const disputeController_1 = require("../controllers/disputeController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Endpoint para que clientes o profesionales puedan levantar una queja/disputa sobre el Escrow
router.post('/open', authMiddleware_1.authenticateJWT, disputeController_1.openDispute);
exports.default = router;
