import { Router } from 'express';
import { submitRequest } from '../controllers/serviceController';
import { authenticateJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint para que un cliente publique una solicitud de problema en su hogar
router.post('/', authenticateJWT, requireRole('client'), submitRequest);

export default router;
