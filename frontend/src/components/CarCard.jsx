"use client"

import { useState } from 'react';

export default function ScheduleForm() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        vehicleInfo: '',
        plate: '',
        email: '',
        phone: '',
        pickAddress: '', 
        dropAddress: '',
        date: '',
        comments: ''
    });

    const handleSchedule = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setFormData({
                    vehicleInfo: '',
                    plate: '',
                    email: '',
                    phone: '',
                    pickAddress: '', 
                    dropAddress: '',
                    date: '',
                    comments: ''
                });
                alert("¡Solicitud Agendada! Se ha creado el evento en el calendario.");
            } else {
                alert("Hubo un problema: " + result.error);
            }
        } catch (error) {
            alert("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto rounded-3xl bg-white p-10 shadow-xl border border-zinc-100">
            <div className="mb-8">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900">
                    Programar <span className="text-blue-600">Traslado</span>
                </h2>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">
                    Servicio de transporte de vehículos
                </p>
            </div>

            <form onSubmit={handleSchedule} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">
                            Información del Vehículo
                        </label>
                        <input 
                            required 
                            type="text" 
                            placeholder="Marca, modelo y año"
                            className="w-full rounded-xl border-zinc-100 bg-zinc-50 text-zinc-700 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all" 
                            value={formData.vehicleInfo}
                            onChange={(e) => setFormData({...formData, vehicleInfo: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">
                            Matrícula
                        </label>
                        <input 
                            required 
                            type="text" 
                            placeholder="1234 ABC"
                            className="w-full rounded-xl border-zinc-100 bg-zinc-50 text-zinc-700 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all uppercase" 
                            value={formData.plate}
                            onChange={(e) => setFormData({...formData, plate: e.target.value.toUpperCase()})} 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">
                            Email de contacto
                        </label>
                        <input 
                            required 
                            type="email" 
                            placeholder="ejemplo@correo.com" 
                            className="w-full rounded-xl border-zinc-100 bg-zinc-50 text-zinc-700 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">
                            Teléfono / WhatsApp
                        </label>
                        <input 
                            required 
                            type="tel" 
                            placeholder="+34 000 000 000" 
                            className="w-full rounded-xl border-zinc-100 bg-zinc-50 px-4 py-3 text-zinc-700 text-sm outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">
                            Dirección de Recogida
                        </label>
                        <input 
                            required 
                            type="text" 
                            placeholder="Calle, número, ciudad..." 
                            className="w-full rounded-xl border-zinc-100 text-zinc-700 bg-zinc-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
                            value={formData.pickAddress}
                            onChange={(e) => setFormData({...formData, pickAddress: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">
                            Dirección de Entrega
                        </label>
                        <input 
                            required 
                            type="text" 
                            placeholder="Calle, número, ciudad..." 
                            className="w-full rounded-xl border-zinc-100 text-zinc-700 bg-zinc-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
                            value={formData.dropAddress}
                            onChange={(e) => setFormData({...formData, dropAddress: e.target.value})} 
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">
                        Fecha Estimada de Recepción
                    </label>
                    <input 
                        required 
                        type="date" 
                        min={new Date().toISOString().split("T")[0]} 
                        className="w-full rounded-xl border-zinc-100 bg-zinc-50 text-zinc-700 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})} 
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">
                        Notas o Requerimientos Especiales
                    </label>
                    <textarea 
                        rows="3" 
                        placeholder="¿Alguna instrucción especial para el transportista?" 
                        className="w-full rounded-xl border-zinc-100 text-zinc-700 bg-zinc-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all resize-none"
                        value={formData.comments}
                        onChange={(e) => setFormData({...formData, comments: e.target.value})}
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full rounded-xl bg-blue-600 py-4 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-zinc-900 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
                >
                    {loading ? 'Procesando...' : 'Confirmar Solicitud'}
                </button>
            </form>
        </div>
    );
}