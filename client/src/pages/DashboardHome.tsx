import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, CalendarCheck, DollarSign, X, Plus } from 'lucide-react';
import SplitText from '../components/SplitText';

function DashboardHome() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = localStorage.getItem('userName') || 'Usuario';

  const handleAnimationComplete = () => {
    console.log('Welcome animation completed!');
  };

  const stats = [
    { title: 'Citas Hoy', value: '12', icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Ingresos Mes', value: '$45,200', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Clientes Nuevos', value: '28', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Crecimiento', value: '+15%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-end">
        <div>
          <div className="mb-2">
            <SplitText 
              text={`Bienvenido de nuevo, ${user}`} 
              className="text-3xl font-bold text-slate-900" 
              delay={30} 
              duration={1} 
              ease="back.out" 
              splitType="chars" 
              from={{ opacity: 0, y: 30 }} 
              to={{ opacity: 1, y: 0 }} 
              threshold={0.1} 
              rootMargin="-50px" 
              textAlign="left" 
              onLetterAnimationComplete={handleAnimationComplete} 
            />
          </div>
          <p className="text-slate-500 mt-2">Aquí tienes un resumen de la actividad de hoy.</p>
        </div>
        
        {/* Botón Nueva Cita con layoutId */}
        <motion.button 
          layoutId="nueva-cita-modal"
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          <span>Nueva Cita</span>
        </motion.button>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            variants={item}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-default group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
            <p className="text-slate-500 font-medium text-sm mt-1">{stat.title}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Gráficos o Listas Recientes Mock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-2"
        >
          <h3 className="font-bold text-lg text-slate-800 mb-6">Próximas Citas</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                  {10 + i}:00
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">Mantenimiento Aire Acondicionado</h4>
                  <p className="text-sm text-slate-500">Cliente: Empresa S.A. de C.V.</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wide">
                  Confirmada
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
          <h3 className="font-bold text-lg mb-4 relative z-10">Avisos del Sistema</h3>
          <div className="space-y-4 relative z-10">
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
              <p className="text-sm font-medium">Actualización de inventario requerida</p>
              <span className="text-xs text-slate-400 mt-2 block">Hace 2 horas</span>
            </div>
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
              <p className="text-sm font-medium">3 Facturas pendientes de envío</p>
              <span className="text-xs text-slate-400 mt-2 block">Hace 5 horas</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal Nueva Cita */}
      <AnimatePresence>
        {isModalOpen && (
          <>
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

                {/* Contenido del formulario */}
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

export default DashboardHome;
