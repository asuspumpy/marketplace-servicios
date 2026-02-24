import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { v4 as uuidv4 } from 'uuid';
import { createQuoteAndVisit, updateVisitStatus, createEscrowPayment } from '../models/visitModel';
import { AntigravitySkills } from '../services/antigravitySkills';
import { updateRequestStatus } from '../models/serviceRequestModel';

// Paso 2: Profesional ofrece realizar visita y cotiza la visita ($)
export const offerVisit = async (req: AuthRequest, res: Response) => {
    try {
        const { request_id, visit_fee } = req.body;
        const professionalId = req.user!.id;
        const offerId = uuidv4();

        await createQuoteAndVisit(offerId, request_id, professionalId, visit_fee);
        await updateRequestStatus(request_id, 'quoting');

        res.status(201).json({
            message: 'Oferta de visita técnica enviada al cliente',
            offerId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar la oferta de visita' });
    }
};

// Paso 3 y 4: Cliente acepta visita y se genera el pago en Escrow
export const acceptVisitAndPay = async (req: AuthRequest, res: Response) => {
    try {
        const { offer_id, request_id, professional_id, visit_fee } = req.body;
        const clientId = req.user!.id;

        // Skill: Gestionar Retención del Fondos Escrow vía MercadoPago
        const escrowResult = await AntigravitySkills.holdEscrowFunds(clientId, professional_id, visit_fee, 'visit_fee');

        // Registrar transacción generada en la base de datos
        const escrowId = uuidv4();
        await createEscrowPayment(
            escrowId, request_id, clientId, professional_id, visit_fee,
            'visit_fee', escrowResult.mp_preference_id, escrowResult.status
        );

        // Actualizar estatus internos de la solicitud
        await updateVisitStatus(offer_id, 'scheduled');
        await updateRequestStatus(request_id, 'visit_scheduled');

        res.status(200).json({
            message: 'Fondos retenidos en Escrow (Pago aprobado). Visita técnica autorizada.',
            escrow_details: escrowResult
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error procesando el Escrow MP' });
    }
};
