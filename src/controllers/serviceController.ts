import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { v4 as uuidv4 } from 'uuid';
import { createServiceRequest, updateRequestComplexity } from '../models/serviceRequestModel';
import { AntigravitySkills } from '../services/antigravitySkills';

export const submitRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { property_id, title, description, preferred_gender } = req.body;
        const clientId = req.user!.id;

        const requestId = uuidv4();

        // Creamos la solicitud de servicio con complejidad pendiente
        await createServiceRequest({
            id: requestId,
            client_id: clientId,
            property_id,
            title,
            description,
            complexity: 'pending_triage',
            preferred_gender: preferred_gender || 'any'
        });

        // 1. Skill: Clasificación Automática de Problemas (Triaje)
        // La AI decide de forma asíncrona si es simple o requiere visita compleja.
        const triageResult: any = await AntigravitySkills.triageProblem(description);

        await updateRequestComplexity(requestId, triageResult.complexity);

        res.status(201).json({
            message: 'Solicitud creada y clasificada exitosamente',
            requestId,
            triage_assigned: triageResult.complexity
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al procesar la solicitud de servicio' });
    }
};
