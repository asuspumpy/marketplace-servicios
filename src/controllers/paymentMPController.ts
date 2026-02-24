import { Request, Response } from 'express';
// @ts-ignore
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuración Global SDK - Obtenemos el Token del Environment (MOCK para el Sandbox)
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-00000000000-000000-00000' });

export const createPreference = async (req: Request, res: Response) => {
    try {
        const { title, unit_price, quantity, service_id, payee_id } = req.body;

        // El Escrow ID en un entorno real sería el ID guardado en tu DB 'escrow_payments'
        const escrow_mock_id = `ESCROW-${Date.now()}`;

        const preference = new Preference(client);

        const response = await preference.create({
            body: {
                items: [
                    {
                        id: service_id,
                        title: title || 'Servicio Profesional (Visita Técnica)',
                        quantity: quantity || 1,
                        unit_price: Number(unit_price),
                        currency_id: 'ARS',
                    }
                ],
                metadata: {
                    service_id: service_id,
                    payee_id: payee_id,
                    escrow_id: escrow_mock_id
                },
                back_urls: {
                    success: 'http://localhost:5173/dashboard?status=success',
                    failure: 'http://localhost:5173/search?status=failure',
                    pending: 'http://localhost:5173/dashboard?status=pending'
                },
                auto_return: 'approved',
                // Webhook Endpoint (En Localhost requeriría ngrok, para Prod la URL Real)
                notification_url: 'https://tu-dominio.com/api/webhooks/mercadopago'
            }
        });

        // Retornamos el Init Point para que el Frontend redirija (Checkout Pro)
        res.status(200).json({
            id: response.id,
            init_point: response.init_point,
            sandbox_init_point: response.sandbox_init_point,
        });

    } catch (error: any) {
        console.error('[PaymentController] Error creando Preference:', error);
        res.status(500).json({ message: 'Error al contactar pasarela de pago.', error: error.message });
    }
};

export const mpWebhookHandler = async (req: Request, res: Response) => {
    try {
        const { type, data } = req.body;

        // 1. Verificación: Mercado Pago manda 'payment' en type
        if (type === 'payment' && data?.id) {
            console.log(`[TrustEngine] Webhook Rercibido. Validando Pago ID: ${data.id}...`);

            // 2. Extraeríamos vía SDK el payment real:
            // const payment = await new Payment(client).get({ id: data.id });
            // const isApproved = payment.status === 'approved';

            // 3. Modificamos la DB a 'held_in_escrow'
            // if (isApproved) {
            //      await db.query("UPDATE escrow_payments SET status='held_in_escrow' WHERE mp_payment_id=?", [payment.id]);
            // }

            return res.status(200).send('Webhook Recibido y Retenido en Escrow');
        }

        return res.status(200).send('Webhook Ignorado');
    } catch (error: any) {
        console.error('[PaymentController] Error procesando Webhook MP:', error);
        // Retornar 200 de todas maneras para que MP no reintente eternamente en caso de fallo interno
        return res.status(200).send('OK');
    }
};
