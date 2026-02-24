import { Router } from 'express';
import { openDispute } from '../controllers/disputeController';
import { authenticateJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint para que clientes o profesionales puedan levantar una queja/disputa sobre el Escrow
router.post('/open', authenticateJWT, openDispute);

export default router;
