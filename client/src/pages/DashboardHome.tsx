import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, DollarSign, X, Plus, Eye, EyeOff } from 'lucide-react';
import SplitText from '../components/SplitText';
import clsx from 'clsx'; // Import clsx for conditional class names
import { format, startOfToday, isBefore, isSameDay } from 'date-fns';
import type { CitaPendiente } from './Citas';
import { supabase } from '../lib/supabase';

interface ServicioCatalogo {
  id_servicio: number;
  nombre: string;
}

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
  const [citasHoy, setCitasHoy] = useState(0);
  const [upcomingCitas, setUpcomingCitas] = useState<(CitaPendiente & { fecha: string; dateTime: Date })[]>([]);
  const [serviciosCatalogo, setServiciosCatalogo] = useState<ServicioCatalogo[]>([]);
  const [formCliente, setFormCliente] = useState('');
  const [formServicio, setFormServicio] = useState('');
  const [formFecha, setFormFecha] = useState('');
  const [formHora, setFormHora] = useState('10:00');
  const [isSaving, setIsSaving] = useState(false);
  const user = localStorage.getItem('userName') || 'Usuario';

  const today = startOfToday();
  const todayKey = format(today, 'yyyy-MM-dd');

  const loadCitasDashboard = async () => {
    try {
      const { data, error } = await supabase
        .from('cita_ui')
        .select('*')
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true });

      if (error) {
        console.error('Error cargando citas para dashboard:', error);
        return;
      }

      if (!data) return;

      const citasEnriquecidas = (data as any[]).map((row) => {
        const fecha = row.fecha as string;
        const horaRaw = String(row.hora ?? '');
        const hora = horaRaw.length >= 5 ? horaRaw.slice(0, 5) : horaRaw;
        const dateTime = new Date(`${fecha}T${hora}:00`);
        return {
          id: row.id as string,
          cliente: row.cliente as string,
          servicio: row.servicio as string,
          hora,
          estado: row.estado as 'confirmada' | 'pendiente',
          fecha,
          dateTime
        };
      });

      const hoy = citasEnriquecidas.filter((cita) => isSameDay(cita.dateTime, today));
      const proximas = citasEnriquecidas
        .filter((cita) => !isBefore(cita.dateTime, today))
        .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
        .slice(0, 3);

      setCitasHoy(hoy.length);
      setUpcomingCitas(proximas);
    } catch (e) {
      console.error('Error inesperado cargando citas para dashboard', e);
    }
  };

  useEffect(() => {
    loadCitasDashboard();
  }, [todayKey, today]);

  useEffect(() => {
    const loadServicios = async () => {
      try {
        const { data, error } = await supabase
          .from('SERVICIO')
          .select('id_servicio, nombre')
          .eq('activo', true)
          .order('nombre');

        if (error) {
          console.error('Error cargando servicios para dashboard:', error);
          return;
        }

        if (data) {
          setServiciosCatalogo(data as any);
        }
      } catch (e) {
        console.error('Error inesperado cargando servicios para dashboard', e);
      }
    };

    loadServicios();
  }, []);

  useEffect(() => {
    if (!formFecha) {
      setFormFecha(todayKey);
    }
  }, [todayKey, formFecha]);

  const handleAgendarCita = async () => {
    if (!formCliente || !formServicio) {
      return;
    }
    setIsSaving(true);
    try {
      const fecha = formFecha || todayKey;
      const hora = formHora || '10:00';

      const { error } = await supabase
        .from('cita_ui')
        .insert({
          fecha,
          hora,
          cliente: formCliente,
          servicio: formServicio,
          estado: 'pendiente'
        });

      if (error) {
        console.error('Error creando cita desde dashboard:', error);
        return;
      }

      await loadCitasDashboard();
      setIsModalOpen(false);
      setFormCliente('');
      setFormServicio('');
      setFormFecha(todayKey);
      setFormHora('10:00');
    } catch (e) {
      console.error('Error inesperado creando cita desde dashboard', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnimationComplete = () => {
    console.log('Welcome animation completed!');
  };

  const stats = [
    { title: 'Citas Hoy', value: String(citasHoy), icon: CalendarCheck },
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
    <div className="space-y-8 relative pb-10 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <div className="mb-1">
            <SplitText
              text={`Bienvenido de nuevo, ${user}`}
              className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
              delay={20}
              duration={0.8}
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
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Resumen general de tu agenda y rendimiento de hoy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97, y: 0 }}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium tracking-tight shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            <span className="text-sm">Nueva cita</span>
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
            className="bg-white/90 dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-default group hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center">
                <stat.icon size={18} />
              </div>
            </div>
            <div className="relative overflow-hidden min-h-[36px] flex items-center">
              <motion.h3
                className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
                transition={{ duration: 0.25 }}
              >
                {stat.value}
              </motion.h3>
            </div>
            <p className="text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400 mt-1 uppercase">
              {stat.title}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Layout Grid Principal: 1/2 Contenido, 1/2 Lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Columna Izquierda: Citas y Avisos */}
        <div className="space-y-8">
          {/* Próximas Citas */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white/90 dark:bg-slate-900/90 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <h3 className="font-semibold text-base text-slate-900 dark:text-slate-50 mb-3 tracking-tight">
              Próximas citas
            </h3>
            {upcomingCitas.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No hay citas programadas próximamente.
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingCitas.map((cita) => (
                  <div
                    key={cita.id}
                    className="flex items-center gap-4 p-4 rounded-xl transition-colors border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 group"
                  >
                    <div className="w-11 h-11 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-full flex items-center justify-center font-semibold text-sm group-hover:scale-105 transition-transform">
                      {format(cita.dateTime, 'HH:mm')}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-slate-900 dark:text-slate-50">
                        {cita.cliente}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{cita.servicio}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {format(cita.dateTime, "d 'de' MMM, yyyy", { locale: undefined })}
                      </p>
                    </div>
                    <span className={clsx(
                      "px-3 py-1 text-[10px] font-semibold rounded-full uppercase tracking-wide",
                      cita.estado === 'confirmada'
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-200"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200"
                    )}>
                      {cita.estado}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Avisos del Sistema (Movido aquí) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-slate-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
            <h3 className="font-semibold text-base mb-4 relative z-10 tracking-tight">Avisos del sistema</h3>
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
          className="h-full bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 relative overflow-hidden flex flex-col"
        >
          <div className="flex flex-col gap-1 mb-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-green-100 text-green-600 dark:bg-emerald-500/10 dark:text-emerald-300 rounded-xl inline-block">
                <DollarSign size={24} />
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Reporte
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
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

                <motion.div
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900 flex-1 overflow-y-auto max-h-[70vh]"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Cliente</label>
                      <input
                        type="text"
                        placeholder="Nombre del cliente..."
                        value={formCliente}
                        onChange={(e) => setFormCliente(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Servicio</label>
                      <select
                        value={formServicio}
                        onChange={(e) => setFormServicio(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                      >
                        <option value="">Seleccionar servicio...</option>
                        {serviciosCatalogo.map((servicio) => (
                          <option key={servicio.id_servicio} value={servicio.nombre}>
                            {servicio.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Fecha</label>
                      <input
                        type="date"
                        value={formFecha}
                        onChange={(e) => setFormFecha(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Hora</label>
                      <input
                        type="time"
                        value={formHora}
                        onChange={(e) => setFormHora(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Notas adicionales</label>
                    <textarea
                      placeholder="Detalles específicos para la cita..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    ></textarea>
                  </div>
                </motion.div>

                <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAgendarCita}
                    disabled={isSaving || !formCliente || !formServicio}
                    className={`px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-blue-900/20 ${
                      (isSaving || !formCliente || !formServicio) ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSaving ? 'Guardando...' : 'Agendar Cita'}
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
