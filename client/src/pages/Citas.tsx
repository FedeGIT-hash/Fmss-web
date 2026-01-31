import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Plus } from 'lucide-react';

function Citas() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative h-full">
      {/* Contenido principal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[600px] flex items-center justify-center flex-col p-8 text-center"
      >
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6">
          <CalendarIcon size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Gestión de Citas</h2>
        <p className="text-slate-500 mt-2 max-w-md mb-8">
          Gestiona tus citas de manera eficiente. Crea nuevas citas para tus clientes.
        </p>
        
        {/* Botón Nueva Cita con layoutId para la transición mágica */}
        <motion.button 
          layoutId="nueva-cita-modal"
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-medium hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          <span>Nueva Cita</span>
        </motion.button>
      </motion.div>

      {/* Modal con animación smooth tipo Apple/Gemini */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop con blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            />
            
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
              <motion.div
                layoutId="nueva-cita-modal"
                className="bg-white w-full max-w-2xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col"
                style={{ borderRadius: 24 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              >
                {/* Header del Modal */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl font-bold text-slate-800 flex items-center gap-2"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <Plus size={18} />
                    </div>
                    Nueva Cita
                  </motion.h3>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Contenido del formulario (Placeholder) */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-8 space-y-6 bg-slate-50/50 flex-1 overflow-y-auto max-h-[70vh]"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Cliente</label>
                      <input type="text" placeholder="Buscar cliente..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Servicio</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white">
                        <option>Seleccionar servicio...</option>
                        <option>Corte de cabello</option>
                        <option>Barba</option>
                        <option>Completo</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Fecha</label>
                      <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Hora</label>
                      <input type="time" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Notas adicionales</label>
                    <textarea placeholder="Detalles específicos para la cita..." rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"></textarea>
                  </div>
                </motion.div>

                {/* Footer del Modal */}
                <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-blue-900/20">
                    Agendar Cita
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Citas;
