import { motion } from 'framer-motion';

function Servicios() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[600px] flex items-center justify-center flex-col p-8 text-center"
    >
      <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Catálogo de Servicios</h2>
      <p className="text-slate-500 mt-2 max-w-md">Administra tus servicios de Plomería, Mantenimiento, Carpintería y Vitropisos.</p>
    </motion.div>
  );
}

export default Servicios;
