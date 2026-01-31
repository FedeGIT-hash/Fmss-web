import { motion } from 'framer-motion';

function Facturacion() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[600px] flex items-center justify-center flex-col p-8 text-center"
    >
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Facturación 4.0</h2>
      <p className="text-slate-500 mt-2 max-w-md">Emisión de facturas, complementos de pago y reportes fiscales.</p>
    </motion.div>
  );
}

export default Facturacion;
