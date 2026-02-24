"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openDispute = void 0;
const uuid_1 = require("uuid");
const disputeModel_1 = require("../models/disputeModel");
const openDispute = async (req, res) => {
    try {
        const { request_id, escrow_id, reason_category, description } = req.body;
        const initiatorId = req.user.id;
        const disputeId = (0, uuid_1.v4)();
        // Creamos la disputa formal
        await (0, disputeModel_1.createDispute)(disputeId, request_id, escrow_id, initiatorId, reason_category, description);
        // Bloqueamos/Modificamos el estado del Pago en Escrow preventivamente
        await (0, disputeModel_1.updateEscrowStatus)(escrow_id, 'disputed');
        // Notificación de que el equipo de Arbitraje revisará el caso usando la Bitácora como prueba.
        res.status(201).json({
            message: 'Disputa abierta correctamente. Los fondos en Escrow han sido congelados hasta resolución.',
            disputeId
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno al intentar abrir la disputa' });
    }
};
exports.openDispute = openDispute;
