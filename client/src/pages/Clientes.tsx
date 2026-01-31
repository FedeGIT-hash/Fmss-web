import { motion } from 'framer-motion';

function Clientes() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[600px] flex items-center justify-center flex-col p-8 text-center"
    >
      <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Directorio de Clientes</h2>
      <p className="text-slate-500 mt-2 max-w-md">Gestión completa de clientes personales y empresas, historial de servicios y datos de facturación.</p>
    </motion.div>
  );
}

export default Clientes;
