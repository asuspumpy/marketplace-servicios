import { dbPool } from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

const initDb = async () => {
    try {
        console.log('Iniciando creación de tablas en la base de datos...');

        const queries = [
            `CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(36) PRIMARY KEY,
                role ENUM('client', 'professional', 'admin') NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                gender ENUM('male', 'female', 'other') NOT NULL,
                phone_number VARCHAR(20),
                status ENUM('pending_kyc', 'active', 'suspended') DEFAULT 'pending_kyc',
                is_risk_user BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );`,
            `CREATE TABLE IF NOT EXISTS legal_agreements (
                id VARCHAR(36) PRIMARY KEY,
                user_id VARCHAR(36) NOT NULL,
                agreement_type ENUM('platform_intermediary_waiver', 'terms_and_conditions') NOT NULL,
                accepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ip_address VARCHAR(45),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );`,
            `CREATE TABLE IF NOT EXISTS professional_profiles (
                user_id VARCHAR(36) PRIMARY KEY,
                category VARCHAR(100) NOT NULL,
                bio TEXT,
                skills JSON,
                rating_avg DECIMAL(3,2) DEFAULT 0.00,
                total_jobs INT DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );`,
            `CREATE TABLE IF NOT EXISTS kyc_verifications (
                id VARCHAR(36) PRIMARY KEY,
                user_id VARCHAR(36) NOT NULL,
                document_type ENUM('dni_front', 'dni_back', 'selfie', 'license_matricula') NOT NULL,
                document_url VARCHAR(255) NOT NULL,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                notes TEXT,
                verified_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );`,
            `CREATE TABLE IF NOT EXISTS client_properties (
                id VARCHAR(36) PRIMARY KEY,
                client_id VARCHAR(36) NOT NULL,
                address_line VARCHAR(255) NOT NULL,
                property_type VARCHAR(100),
                notes TEXT, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
            );`,
            `CREATE TABLE IF NOT EXISTS service_requests (
                id VARCHAR(36) PRIMARY KEY,
                client_id VARCHAR(36) NOT NULL,
                property_id VARCHAR(36) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                complexity ENUM('simple', 'complex', 'pending_triage') DEFAULT 'pending_triage',
                preferred_gender ENUM('any', 'female_only') DEFAULT 'any',
                status ENUM('open', 'quoting', 'visit_scheduled', 'in_progress', 'completed', 'disputed', 'cancelled') DEFAULT 'open',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (property_id) REFERENCES client_properties(id) ON DELETE CASCADE
            );`,
            `CREATE TABLE IF NOT EXISTS quotes_and_visits (
                id VARCHAR(36) PRIMARY KEY,
                request_id VARCHAR(36) NOT NULL,
                professional_id VARCHAR(36) NOT NULL,
                visit_fee DECIMAL(10,2) NOT NULL, 
                visit_status ENUM('pending_payment', 'scheduled', 'completed', 'waived') DEFAULT 'pending_payment',
                final_labor_cost DECIMAL(10,2),
                materials_cost DECIMAL(10,2),
                quote_status ENUM('draft', 'submitted', 'accepted', 'rejected') DEFAULT 'draft',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (request_id) REFERENCES service_requests(id) ON DELETE CASCADE,
                FOREIGN KEY (professional_id) REFERENCES users(id) ON DELETE CASCADE
            );`,
            `CREATE TABLE IF NOT EXISTS escrow_payments (
                id VARCHAR(36) PRIMARY KEY,
                request_id VARCHAR(36) NOT NULL,
                payer_id VARCHAR(36) NOT NULL,
                payee_id VARCHAR(36) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                purpose ENUM('visit_fee', 'final_job') NOT NULL,
                mp_preference_id VARCHAR(255), 
                mp_payment_id VARCHAR(255),
                status ENUM('pending', 'held_in_escrow', 'released', 'refunded', 'disputed') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                released_at TIMESTAMP NULL,
                FOREIGN KEY (request_id) REFERENCES service_requests(id) ON DELETE CASCADE,
                FOREIGN KEY (payer_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (payee_id) REFERENCES users(id) ON DELETE CASCADE
            );`,
            `CREATE TABLE IF NOT EXISTS service_logs (
                id VARCHAR(36) PRIMARY KEY,
                request_id VARCHAR(36) NOT NULL,
                professional_id VARCHAR(36) NOT NULL,
                action_type ENUM('arrival', 'diagnosis', 'quote_submitted', 'work_started', 'milestone_reached', 'work_finished') NOT NULL,
                description TEXT NOT NULL,
                media_urls JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (request_id) REFERENCES service_requests(id) ON DELETE CASCADE,
                FOREIGN KEY (professional_id) REFERENCES users(id) ON DELETE CASCADE
            );`,
            `CREATE TABLE IF NOT EXISTS disputes (
                id VARCHAR(36) PRIMARY KEY,
                request_id VARCHAR(36) NOT NULL,
                escrow_id VARCHAR(36) NOT NULL,
                initiator_id VARCHAR(36) NOT NULL,
                reason_category VARCHAR(100) NOT NULL,
                description TEXT NOT NULL,
                status ENUM('open', 'under_review', 'resolved_refund', 'resolved_release', 'arbitration') DEFAULT 'open',
                resolution_notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (request_id) REFERENCES service_requests(id) ON DELETE CASCADE,
                FOREIGN KEY (escrow_id) REFERENCES escrow_payments(id) ON DELETE CASCADE,
                FOREIGN KEY (initiator_id) REFERENCES users(id) ON DELETE CASCADE
            );`,
            `CREATE TABLE IF NOT EXISTS reviews (
                id VARCHAR(36) PRIMARY KEY,
                request_id VARCHAR(36) NOT NULL,
                reviewer_id VARCHAR(36) NOT NULL,
                reviewee_id VARCHAR(36) NOT NULL,
                rating INT CHECK (rating BETWEEN 1 AND 5),
                comment TEXT,
                is_risk_flag BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (request_id) REFERENCES service_requests(id) ON DELETE CASCADE,
                FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
            );`
        ];

        for (const query of queries) {
            await dbPool.query(query);
            console.log('Query ejecutada con éxito.');
        }

        console.log('¡Todas las tablas fueron creadas exitosamente!');
    } catch (error) {
        console.error('Error al instanciar la base de datos:', error);
    } finally {
        process.exit();
    }
};

initDb();
