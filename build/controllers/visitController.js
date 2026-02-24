"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptVisitAndPay = exports.offerVisit = void 0;
const uuid_1 = require("uuid");
const visitModel_1 = require("../models/visitModel");
const antigravitySkills_1 = require("../services/antigravitySkills");
const serviceRequestModel_1 = require("../models/serviceRequestModel");
// Paso 2: Profesional ofrece realizar visita y cotiza la visita ($)
const offerVisit = async (req, res) => {
    try {
        const { request_id, visit_fee } = req.body;
        const professionalId = req.user.id;
        const offerId = (0, uuid_1.v4)();
        await (0, visitModel_1.createQuoteAndVisit)(offerId, request_id, professionalId, visit_fee);
        await (0, serviceRequestModel_1.updateRequestStatus)(request_id, 'quoting');
        res.status(201).json({
            message: 'Oferta de visita técnica enviada al cliente',
            offerId
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar la oferta de visita' });
    }
};
exports.offerVisit = offerVisit;
// Paso 3 y 4: Cliente acepta visita y se genera el pago en Escrow
const acceptVisitAndPay = async (req, res) => {
    try {
        const { offer_id, request_id, professional_id, visit_fee } = req.body;
        const clientId = req.user.id;
        // Skill: Gestionar Retención del Fondos Escrow vía MercadoPago
        const escrowResult = await antigravitySkills_1.AntigravitySkills.holdEscrowFunds(clientId, professional_id, visit_fee, 'visit_fee');
        // Registrar transacción generada en la base de datos
        const escrowId = (0, uuid_1.v4)();
        await (0, visitModel_1.createEscrowPayment)(escrowId, request_id, clientId, professional_id, visit_fee, 'visit_fee', escrowResult.mp_preference_id, escrowResult.status);
        // Actualizar estatus internos de la solicitud
        await (0, visitModel_1.updateVisitStatus)(offer_id, 'scheduled');
        await (0, serviceRequestModel_1.updateRequestStatus)(request_id, 'visit_scheduled');
        res.status(200).json({
            message: 'Fondos retenidos en Escrow (Pago aprobado). Visita técnica autorizada.',
            escrow_details: escrowResult
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error procesando el Escrow MP' });
    }
};
exports.acceptVisitAndPay = acceptVisitAndPay;
