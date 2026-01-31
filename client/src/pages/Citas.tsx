import { motion } from 'framer-motion';

function Citas() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[600px] flex items-center justify-center flex-col p-8 text-center"
    >
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Calendario de Citas</h2>
      <p className="text-slate-500 mt-2 max-w-md">Aquí podrás visualizar y gestionar todas las citas programadas en un calendario interactivo o vista de lista.</p>
      <button className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all">
        Próximamente
      </button>
    </motion.div>
  );
}

export default Citas;
