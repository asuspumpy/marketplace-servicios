"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = require("../controllers/serviceController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Endpoint para que un cliente publique una solicitud de problema en su hogar
router.post('/', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.requireRole)('client'), serviceController_1.submitRequest);
exports.default = router;
