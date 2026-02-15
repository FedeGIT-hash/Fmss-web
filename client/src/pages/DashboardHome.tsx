import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, DollarSign, X, Plus, Eye, EyeOff } from 'lucide-react';
import SplitText from '../components/SplitText';
import clsx from 'clsx'; // Import clsx for conditional class names

// Componente de velas grandes estilizadas (Gráfico Principal)
const BigCandles = () => {
  // Datos simulados para las velas (más datos para gráfico grande)
  const candles = [
    { h: 40, y: 30, color: 'cyan' }, { h: 25, y: 50, color: 'red' }, { h: 50, y: 20, color: 'cyan' },
    { h: 35, y: 40, color: 'cyan' }, { h: 20, y: 60, color: 'red' }, { h: 45, y: 25, color: 'cyan' },
    { h: 60, y: 10, color: 'cyan' }, { h: 55, y: 20, color: 'red' }, { h: 70, y: 15, color: 'cyan' },
    { h: 65, y: 25, color: 'cyan' }, { h: 40, y: 50, color: 'red' }, { h: 80, y: 5, color: 'cyan' },
    { h: 75, y: 15, color: 'cyan' }, { h: 50, y: 40, color: 'red' }, { h: 85, y: 10, color: 'cyan' },
    { h: 90, y: 5, color: 'cyan' }, { h: 60, y: 30, color: 'cyan' }, { h: 40, y: 45, color: 'red' },
    { h: 70, y: 20, color: 'cyan' }
  ];

  // Generar etiquetas de meses (simulando histórico hacia atrás)
  const getMonthLabel = (index: number) => {
    const today = new Date();
    // Asumimos que cada vela es un mes para este ejemplo, o semanas.
    // El usuario pidió "de que mes fue". Vamos a asumir que son meses.
    // Como son muchos datos para meses (19), quizás son semanas?
    // Pero el usuario dijo "mes de ganancia". Haremos que sean meses pasados.
    const d = new Date(today.getFullYear(), today.getMonth() - (candles.length - 1 - index), 1);
    return d.toLocaleString('es-ES', { month: 'short', year: '2-digit' });
  };

  return (
    <div className="w-full h-96 flex items-end justify-between gap-1 mt-4 px-4 select-none cursor-crosshair">
      {candles.map((c, i) => (
        <motion.div
          key={i}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: '100%', opacity: 1 }}
          transition={{ delay: i * 0.05, duration: 0.5 }}
          className="relative flex-1 flex flex-col items-center justify-end h-full group"
        >
          {/* Tooltip mejorado */}
          <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-3 py-2 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-xl flex flex-col items-center gap-1">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">{getMonthLabel(i)}</span>
            <span className="font-mono text-cyan-300 text-sm">${(c.h * 100).toLocaleString()}</span>
            {/* Triangulito del tooltip */}
            <div className="absolute -bottom-1 w-2 h-2 bg-slate-800 rotate-45"></div>
          </div>

          {/* Mecha */}
          <div
            className={`w-[2px] absolute top-0 bottom-0 ${c.color === 'cyan' ? 'bg-cyan-200' : 'bg-rose-200'}`}
            style={{
              top: `${c.y - 10}%`,
              bottom: `${100 - (c.y + c.h + 10)}%`,
              opacity: 0.6
            }}
          />
          {/* Cuerpo */}
          <div
            className={`w-full max-w-[16px] rounded-[2px] transition-all duration-300 group-hover:brightness-110 ${c.color === 'cyan'
              ? 'bg-gradient-to-t from-cyan-500 to-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
              : 'bg-gradient-to-t from-rose-500 to-rose-300 shadow-[0_0_15px_rgba(251,113,133,0.3)]'
              }`}
            style={{
              height: `${c.h}%`,
              marginTop: `${c.y}%`
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

function DashboardHome() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showGains, setShowGains] = useState(true);
  const user = localStorage.getItem('userName') || 'Usuario';

  const handleAnimationComplete = () => {
    console.log('Welcome animation completed!');
  };

  const stats = [
    { title: 'Citas Hoy', value: '12', icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-100', isMoney: false },
    // "Ingresos Mes" eliminado de aquí para moverlo abajo
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
    <div className="space-y-8 relative pb-10">
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

        <div className="flex items-center gap-3">
          {/* Botón para ocultar/mostrar ganancias */}


          {/* Botón Nueva Cita sin layoutId compartido */}
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <Plus size={20} />
            <span>Nueva Cita</span>
          </motion.button>
        </div>
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
            className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-default group hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={clsx("p-3 rounded-xl", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="relative overflow-hidden min-h-[40px] flex items-center">
              <motion.h3
                className="text-3xl font-bold text-slate-800"
                animate={{
                  filter: stat.isMoney && !showGains ? "blur(8px)" : "blur(0px)",
                  opacity: stat.isMoney && !showGains ? 0.5 : 1,
                  y: stat.isMoney && !showGains ? 5 : 0
                }}
                transition={{ duration: 0.4 }}
              >
                {stat.value}
              </motion.h3>
            </div>
            <p className="text-slate-500 font-medium text-sm mt-1">{stat.title}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Layout Grid Principal: 1/2 Contenido, 1/2 Lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Columna Izquierda: Citas y Avisos */}
        <div className="space-y-8">
          {/* Próximas Citas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <h3 className="font-bold text-lg text-slate-800 mb-6">Próximas Citas</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100 group">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 group-hover:scale-110 transition-transform">
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

          {/* Avisos del Sistema (Movido aquí) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1"
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

        {/* Columna Derecha: Gráfico de Ingresos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="h-full bg-white p-6 rounded-3xl shadow-lg border border-slate-100 relative overflow-hidden flex flex-col"
        >
          <div className="flex flex-col gap-1 mb-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl inline-block">
                <DollarSign size={24} />
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Reporte
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-bold text-slate-900">
                {showGains ? '$45,200' : '••••••'}
              </h3>
              <p className="text-green-600 font-medium text-sm flex items-center gap-1 mt-1">
                ▲ 12.5% vs mes anterior
              </p>
            </div>
          </div>

          {/* Gráfico */}
          <div className="flex-1 flex flex-col justify-end min-h-[300px]">
            {showGains ? (
              <BigCandles />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 italic">
                <div className="flex flex-col items-center gap-2">
                  <EyeOff size={48} className="opacity-20" />
                  <p>Gráfico oculto</p>
                </div>
              </div>
            )}
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
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10, transition: { duration: 0.2 } }}
                className="bg-white w-full max-w-2xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col"
                style={{ borderRadius: 24, willChange: "transform, opacity" }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                  mass: 0.5
                }}
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
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.2, duration: 0.4 }}
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
                        <option value="Mini Split Convencional">Mantenimiento Mini Split Convencional</option>
                        <option value="Mini Split Inverter">Mantenimiento Mini Split Inverter</option>
                        <option value="Instalación Mini Split Convencional">Instalación Mini Split Convencional</option>
                        <option value="Instalación Mini Split Inverter">Instalación Mini Split Inverter</option>
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
