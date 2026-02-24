"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logController_1 = require("../controllers/logController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Endpoint para que un profesional agregue un avance (con fotos) a la Bitácora
router.post('/bitacora', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.requireRole)('professional'), logController_1.addLogToBitacora);
exports.default = router;
