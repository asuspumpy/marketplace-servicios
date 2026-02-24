import React, { useState } from 'react';
import {
    Activity, ShieldAlert, DollarSign, Users,
    CheckCircle, XCircle, FileText, AlertTriangle
} from 'lucide-react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

// MOCK DATA: Finanzas
const financeData = [
    { name: 'Lun', escrow: 4000, comision: 400 },
    { name: 'Mar', escrow: 3000, comision: 300 },
    { name: 'Mié', escrow: 5000, comision: 500 },
    { name: 'Jue', escrow: 2780, comision: 278 },
    { name: 'Vie', escrow: 8900, comision: 890 },
    { name: 'Sáb', escrow: 2390, comision: 239 },
    { name: 'Dom', escrow: 3490, comision: 349 },
];

// MOCK DATA: KYC Pendientes
const pendingKYC = [
    { id: 'PRO-102', name: 'Marcos Silva', role: 'Gasista', date: '2023-10-25' },
    { id: 'PRO-105', name: 'Andrea Gómez', role: 'Plomería', date: '2023-10-26' }
];

// MOCK DATA: Disputas
const activeDisputes = [
    { id: 'DISP-001', serviceId: 'REQ-882', client: 'CLIENT-09', pro: 'PRO-33', amount: '$15.000', status: 'under_review' }
];

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('finances');

    const handleApproveKYC = (id: string) => {
        alert(`Identidad del profesional ${id} aprobada con éxito. Flag 'pending_kyc' removido.`);
    };

    const handleRejectKYC = (id: string) => {
        alert(`Identidad ${id} rechazada. Usuario suspendido por intento de fraude.`);
    };

    const handleReleaseEscrow = (id: string) => {
        alert(`ALERTA ROJA: Fondos del Escrow ${id} liberados manualmente al Profesional a favor de la disputa.`);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-6 font-sans selection:bg-primary/30">
            {/* Header del Command Center */}
            <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
                        <Activity className="text-primary animate-pulse" size={36} />
                        Command Center <span className="text-gray-600 text-2xl font-normal ml-2">v1.2</span>
                    </h1>
                    <p className="text-gray-400 mt-2">Nivel de Autorización: Sistema (Root)</p>
                </div>

                <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setActiveTab('finances')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'finances' ? 'bg-primary text-black shadow-[0_0_15px_rgba(12,235,235,0.4)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        Finanzas & Escrow
                    </button>
                    <button
                        onClick={() => setActiveTab('kyc')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'kyc' ? 'bg-accent text-black shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        KYC Security {pendingKYC.length > 0 && <span className="bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{pendingKYC.length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('disputes')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'disputes' ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        Disputas Abiertas
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                {/* 1. Finanzas (Mercado Pago Escrow Real-Time) */}
                {activeTab === 'finances' && (
                    <div className="animate-fade-in-up space-y-6">
                        {/* KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full mix-blend-screen filter blur-[40px] group-hover:bg-primary/20 transition-all"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-primary/10 rounded-xl"><DollarSign className="text-primary" /></div>
                                    <span className="text-green-400 text-sm font-bold bg-green-400/10 px-2 py-1 rounded">+12.5%</span>
                                </div>
                                <h3 className="text-gray-400 text-sm font-semibold mb-1">Capital Total en Escrow</h3>
                                <p className="text-4xl font-black tracking-tight text-white">$2.54M</p>
                            </div>

                            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full mix-blend-screen filter blur-[40px] group-hover:bg-accent/20 transition-all"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-accent/10 rounded-xl"><Activity className="text-accent" /></div>
                                </div>
                                <h3 className="text-gray-400 text-sm font-semibold mb-1">Ganancias (Comisiones MP)</h3>
                                <p className="text-4xl font-black tracking-tight text-white">$254.000</p>
                            </div>

                            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-2xl relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-white/5 rounded-xl"><Users className="text-gray-300" /></div>
                                </div>
                                <h3 className="text-gray-400 text-sm font-semibold mb-1">Transacciones Exitosas Hoy</h3>
                                <p className="text-4xl font-black tracking-tight text-white">142</p>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-2xl">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Activity size={18} className="text-primary" /> Flujo de Capital Retenido vs Liberado</h3>
                            <div className="w-full h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={financeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorEscrow" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0cebeb" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#0cebeb" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorComision" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#333" />
                                        <YAxis stroke="#333" />
                                        <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                                        <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '12px' }} />
                                        <Area type="monotone" dataKey="escrow" stroke="#0cebeb" strokeWidth={3} fillOpacity={1} fill="url(#colorEscrow)" />
                                        <Area type="monotone" dataKey="comision" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorComision)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. KYC Security (Aprobador de Matrículas e Identidad) */}
                {activeTab === 'kyc' && (
                    <div className="animate-fade-in-up">
                        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-[#1a1a1a] flex justify-between items-center bg-accent/5">
                                <h3 className="text-lg font-bold flex items-center gap-2 tracking-tight text-accent">
                                    <ShieldAlert size={20} /> Revisiones Manuales de Identidad
                                </h3>
                                <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-bold font-mono">
                                    {pendingKYC.length} PENDING
                                </span>
                            </div>

                            <div className="p-6">
                                {pendingKYC.map((kyc) => (
                                    <div key={kyc.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-black border border-[#222] rounded-xl mb-4 hover:border-accent/50 transition-colors">
                                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center font-bold text-gray-400">
                                                {kyc.name[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white flex items-center gap-2">
                                                    {kyc.name} <span className="text-xs font-normal text-gray-500">({kyc.id})</span>
                                                </h4>
                                                <p className="text-sm text-gray-400">{kyc.role} • Registro: {kyc.date}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <button className="text-sm text-accent hover:underline flex items-center gap-1">
                                                <FileText size={16} /> Ver DNI/Matrícula
                                            </button>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleRejectKYC(kyc.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Rechazar y Suspender">
                                                    <XCircle size={20} />
                                                </button>
                                                <button onClick={() => handleApproveKYC(kyc.id)} className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-colors" title="Aprobar Profesional">
                                                    <CheckCircle size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {pendingKYC.length === 0 && (
                                    <p className="text-center text-gray-500 py-10">No hay profesionales pendientes de validación KYC.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Disputas Abiertas (Botón Rojo de Emergencia) */}
                {activeTab === 'disputes' && (
                    <div className="animate-fade-in-up">
                        <div className="bg-[#1a0505] border border-red-500/20 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-red-900/50 flex justify-between items-center bg-red-500/10">
                                <h3 className="text-lg font-bold flex items-center gap-2 tracking-tight text-red-500">
                                    <AlertTriangle size={20} /> Conflictos y Arbitraje Escrow
                                </h3>
                            </div>

                            <div className="p-6">
                                {activeDisputes.map(dispute => (
                                    <div key={dispute.id} className="border border-red-900/50 rounded-xl p-6 bg-black">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h4 className="font-bold text-white text-lg mb-1">{dispute.id} <span className="text-sm font-normal text-red-400 bg-red-400/10 px-2 py-0.5 rounded">Bajo Revisión</span></h4>
                                                <p className="text-gray-400 text-sm">Problema entre <span className="text-white">{dispute.client}</span> y <span className="text-white">{dispute.pro}</span> por Servicio <span className="font-mono text-primary">{dispute.serviceId}</span></p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-500 text-sm">Monto Retenido</p>
                                                <p className="text-2xl font-black text-white">{dispute.amount}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                                                Revisar Bitácora (Evidencia)
                                            </button>
                                            <button
                                                onClick={() => handleReleaseEscrow(dispute.id)}
                                                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)] text-sm uppercase tracking-wider"
                                            >
                                                Force Release a Profesional
                                            </button>
                                            <button
                                                className="flex-1 bg-transparent border border-gray-600 hover:border-gray-400 text-gray-300 font-bold py-3 rounded-xl transition-colors text-sm uppercase tracking-wider"
                                            >
                                                Force Refund a Cliente
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
