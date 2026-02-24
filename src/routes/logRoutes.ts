import { Router } from 'express';
import { addLogToBitacora } from '../controllers/logController';
import { authenticateJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint para que un profesional agregue un avance (con fotos) a la Bitácora
router.post('/bitacora', authenticateJWT, requireRole('professional'), addLogToBitacora);

export default router;
