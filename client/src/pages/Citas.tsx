import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  CheckCircle2,
  X,
  MoreVertical
} from 'lucide-react';
import clsx from 'clsx';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isPast, isFuture, getDay } from 'date-fns';
import { es } from 'date-fns/locale';

// Tipos para nuestros datos mock
type ServicioRealizado = {
  id: string;
  servicio: string;
  cliente: string;
  tiempo: string; // "45 min"
  precio: number;
  hora: string;
};

type CitaPendiente = {
  id: string;
  cliente: string;
  servicio: string;
  hora: string;
  estado: 'confirmada' | 'pendiente';
};

type DatosDia = {
  fecha: string; // YYYY-MM-DD
  gananciaTotal?: number;
  serviciosRealizados?: ServicioRealizado[];
  citasPendientes?: CitaPendiente[];
};

// Generador de datos mock
const generateMockData = (): Record<string, DatosDia> => {
  const data: Record<string, DatosDia> = {};
  const today = new Date();
  const start = startOfMonth(subMonths(today, 1)); // Desde mes pasado
  const end = endOfMonth(addMonths(today, 1)); // Hasta mes siguiente
  const days = eachDayOfInterval({ start, end });

  days.forEach(day => {
    const dateKey = format(day, 'yyyy-MM-dd');

    if (isPast(day) && !isToday(day)) {
      // Días pasados: Tienen ganancias y servicios históricos
      const numServicios = Math.floor(Math.random() * 5) + 1; // 1 to 5 servicios
      const serviciosPosibles = [
        { nombre: 'Mantenimiento Mini Split Convencional', precio: 500, tiempo: 60 },
        { nombre: 'Mantenimiento Mini Split Inverter', precio: 600, tiempo: 60 },
        { nombre: 'Instalación Mini Split Convencional', precio: 1200, tiempo: 180 },
        { nombre: 'Instalación Mini Split Inverter', precio: 1500, tiempo: 180 }
      ];

      const servicios: ServicioRealizado[] = Array.from({ length: numServicios }).map((_, i) => {
        const servicioElegido = serviciosPosibles[Math.floor(Math.random() * serviciosPosibles.length)];
        return {
          id: `${dateKey}-${i}`,
          servicio: servicioElegido.nombre,
          cliente: ['Empresa ABC', 'Juan Pérez', 'Comercializadora X', 'María López'][Math.floor(Math.random() * 4)],
          tiempo: `${servicioElegido.tiempo} min`,
          precio: servicioElegido.precio,
          hora: `${9 + i}:00`
        };
      });

      data[dateKey] = {
        fecha: dateKey,
        gananciaTotal: servicios.reduce((acc, curr) => acc + curr.precio, 0),
        serviciosRealizados: servicios
      };
    } else {
      // Hoy y Futuro: Tienen citas pendientes
      const numCitas = Math.floor(Math.random() * 4); // 0 to 3 citas
      if (numCitas > 0) {
        const serviciosNombres = [
          'Mantenimiento Mini Split Convencional',
          'Mantenimiento Mini Split Inverter',
          'Instalación Mini Split Convencional',
          'Instalación Mini Split Inverter'
        ];

        const citas: CitaPendiente[] = Array.from({ length: numCitas }).map((_, i) => ({
          id: `${dateKey}-${i}`,
          cliente: ['Tech Solutions', 'Pedro Gómez', 'Librería Central', 'Ana Torres'][Math.floor(Math.random() * 4)],
          servicio: serviciosNombres[Math.floor(Math.random() * serviciosNombres.length)],
          hora: `${10 + i}:30`,
          estado: Math.random() > 0.3 ? 'confirmada' : 'pendiente'
        }));

        data[dateKey] = {
          fecha: dateKey,
          citasPendientes: citas
        };
      }
    }
  });

  return data;
};

const MOCK_DB = generateMockData();

// NO TOCAR generateMockData ni MOCK_DB, están bien fuera.

function Citas() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);

  // Navegación principal (flechas)
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Navegación Selector de Año
  const nextYear = () => setCurrentDate(addMonths(currentDate, 12));
  const prevYear = () => setCurrentDate(subMonths(currentDate, 12));

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    setIsMonthSelectorOpen(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentDate.getFullYear(), monthIndex, 1);
    setCurrentDate(newDate);
    setIsMonthSelectorOpen(false);
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const firstDayOfMonth = getDay(startOfMonth(currentDate));
  const startingDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const emptyDays = Array.from({ length: startingDayIndex });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const selectedDateData = selectedDate ? MOCK_DB[format(selectedDate, 'yyyy-MM-dd')] : null;
  const isSelectedPast = selectedDate ? (isPast(selectedDate) && !isToday(selectedDate)) : false;

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">

      {/* SECCIÓN CALENDARIO */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative"
      >
        {/* Header Calendario */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100 z-20 relative bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMonthSelectorOpen(!isMonthSelectorOpen)}
              className="group flex items-center gap-2 px-3 py-2 -ml-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
            >
              <div className="text-left">
                <h2 className="text-2xl font-bold text-slate-800 capitalize flex items-center gap-2">
                  {format(currentDate, 'MMMM', { locale: es })}
                  <span className="text-slate-400 font-normal">{format(currentDate, 'yyyy')}</span>
                  <ChevronRight size={20} className={clsx("text-slate-400 transition-transform duration-300", isMonthSelectorOpen && "rotate-90")} />
                </h2>
                <p className="text-slate-500 text-sm">
                  {isMonthSelectorOpen ? 'Selecciona un mes' : 'Gestiona tu agenda'}
                </p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors mr-2"
            >
              Hoy
            </button>
            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL: CLENDARIO O SELECTOR */}
        <div className="flex-1 relative overflow-hidden">

          {/* SELECTOR DE MESES (OVERLAY) */}
          <AnimatePresence>
            {isMonthSelectorOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-8"
              >
                <div className="w-full max-w-3xl">
                  {/* Selector de Año */}
                  <div className="flex items-center justify-center gap-8 mb-10">
                    <button onClick={prevYear} className="p-3 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors">
                      <ChevronLeft size={32} />
                    </button>
                    <span className="text-5xl font-bold text-slate-800 tracking-tight">
                      {format(currentDate, 'yyyy')}
                    </span>
                    <button onClick={nextYear} className="p-3 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors">
                      <ChevronRight size={32} />
                    </button>
                  </div>

                  {/* Grid de Meses */}
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                    {months.map((month, index) => {
                      const isSelectedMonth = index === currentDate.getMonth();
                      const isCurrentMonth = index === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

                      return (
                        <button
                          key={month}
                          onClick={() => handleMonthSelect(index)}
                          className={clsx(
                            "py-4 px-2 rounded-2xl text-lg font-medium transition-all duration-200",
                            isSelectedMonth
                              ? "bg-slate-900 text-white shadow-lg scale-105"
                              : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:scale-105",
                            isCurrentMonth && !isSelectedMonth && "ring-2 ring-blue-500 ring-offset-2"
                          )}
                        >
                          {month}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* GRID CALENDARIO (Solo visible si el selector está cerrado o detrás) */}
          <div className="flex-1 p-6 h-full flex flex-col">
            <div className="grid grid-cols-7 mb-4 shrink-0">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 grid-rows-5 gap-2 h-full min-h-[400px]">
              {emptyDays.map((_, i) => (
                <div key={`empty-${i}`} className="bg-transparent" />
              ))}

              {daysInMonth.map((day) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const dayData = MOCK_DB[dateKey];
                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                const isTodayDate = isToday(day);
                const isDayPast = isPast(day) && !isToday(day);

                return (
                  <motion.button
                    key={day.toString()}
                    onClick={() => handleDateClick(day)}
                    whileHover={{ scale: 0.98 }}
                    whileTap={{ scale: 0.95 }}
                    className={clsx(
                      "relative rounded-2xl border p-2 flex flex-col items-start justify-between min-h-[80px] transition-all duration-200",
                      isSelected
                        ? "ring-2 ring-blue-500 ring-offset-2 z-10 shadow-lg"
                        : "hover:shadow-md",
                      isTodayDate
                        ? "bg-blue-50/50 border-blue-200"
                        : "bg-white border-slate-100",
                      selectedDate && !isSelected && "opacity-60 grayscale-[0.5]" // Dim other days when one is selected
                    )}
                  >
                    <span className={clsx(
                      "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full mb-1",
                      isTodayDate ? "bg-blue-600 text-white" : "text-slate-700",
                      isSelected && !isTodayDate && "bg-slate-900 text-white"
                    )}>
                      {format(day, 'd')}
                    </span>

                    {/* Indicadores de Eventos */}
                    <div className="w-full flex-1 flex flex-col gap-1 overflow-hidden">
                      {dayData?.citasPendientes && (
                        <div className="w-full bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-md truncate font-medium">
                          {dayData.citasPendientes.length} Cita{dayData.citasPendientes.length > 1 ? 's' : ''}
                        </div>
                      )}
                      {dayData?.gananciaTotal && (
                        <div className="w-full bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-md truncate font-medium flex items-center gap-1">
                          <DollarSign size={10} />
                          {dayData.gananciaTotal}
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* SECCIÓN DETALLES (PANEL LATERAL) */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            key="details-panel"
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 380 }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col"
          >
            {/* Header del Panel */}
            <div className={clsx(
              "p-6 flex items-center justify-between text-white relative overflow-hidden",
              isSelectedPast ? "bg-slate-900" : "bg-blue-600"
            )}>
              <div className="relative z-10">
                <p className="text-white/80 text-sm font-medium uppercase tracking-wide">
                  {isSelectedPast ? 'Resumen del Día' : 'Agenda del Día'}
                </p>
                <h3 className="text-3xl font-bold mt-1 capitalize">
                  {format(selectedDate, 'EEEE d', { locale: es })}
                </h3>
                <p className="text-white/90 text-sm mt-1 capitalize opacity-80">
                  {format(selectedDate, 'MMMM yyyy', { locale: es })}
                </p>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="relative z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
              >
                <X size={18} className="text-white" />
              </button>

              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            </div>

            {/* Contenido Dinámico */}
            <motion.div
              className="flex-1 overflow-y-auto p-6 space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >

              {!selectedDateData && (
                <motion.div
                  variants={itemVariants}
                  className="h-full flex flex-col items-center justify-center text-slate-400 text-center space-y-4 py-12"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                    <CalendarIcon size={32} className="opacity-50" />
                  </div>
                  <p>No hay actividad registrada para este día.</p>
                  {!isSelectedPast && (
                    <button className="text-blue-600 text-sm font-medium hover:underline">
                      + Agregar Cita Nueva
                    </button>
                  )}
                </motion.div>
              )}

              {/* VISTA PASADA: REPORTE FINANCIERO */}
              {isSelectedPast && selectedDateData?.gananciaTotal && (
                <>
                  {/* KPI Principal */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">Total Generado</p>
                      <p className="text-3xl font-bold text-emerald-700">${selectedDateData.gananciaTotal.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                      <DollarSign size={24} />
                    </div>
                  </motion.div>

                  {/* Lista de Servicios Realizados */}
                  <motion.div variants={itemVariants}>
                    <h4 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-slate-400" />
                      Servicios Completados
                    </h4>
                    <div className="space-y-3">
                      {selectedDateData.serviciosRealizados?.map((servicio) => (
                        <div key={servicio.id} className="group flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                          <div className="mt-1 w-2 h-2 rounded-full bg-slate-300 group-hover:bg-slate-800 transition-colors"></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h5 className="font-semibold text-slate-800 text-sm">{servicio.servicio}</h5>
                              <span className="text-slate-600 font-bold text-xs bg-slate-100 px-2 py-1 rounded-full">${servicio.precio}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{servicio.cliente}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                              <span className="flex items-center gap-1"><Clock size={10} /> {servicio.hora}</span>
                              <span className="flex items-center gap-1"><Clock size={10} /> Duración: {servicio.tiempo}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}

              {/* VISTA FUTURA/HOY: CITAS PENDIENTES */}
              {!isSelectedPast && selectedDateData?.citasPendientes && (
                <>
                  <motion.div
                    variants={itemVariants}
                    className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-2"
                  >
                    <p className="text-blue-600 text-sm font-medium">
                      Tienes <strong>{selectedDateData.citasPendientes.length} citas</strong> programadas para este día.
                    </p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-3">
                    {selectedDateData.citasPendientes.map((cita) => (
                      <div key={cita.id} className="relative bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-2">
                          <span className={clsx(
                            "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                            cita.estado === 'confirmada' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                          )}>
                            {cita.estado}
                          </span>
                          <button className="text-slate-300 hover:text-slate-600 transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </div>

                        <h4 className="font-bold text-slate-800">{cita.cliente}</h4>
                        <p className="text-sm text-slate-500 mb-3">{cita.servicio}</p>

                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 py-2 px-3 rounded-lg w-max">
                          <Clock size={14} className="text-blue-500" />
                          {cita.hora}
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>

                  <motion.button
                    variants={itemVariants}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    <span className="text-xl">+</span> Agendar Nueva Cita
                  </motion.button>
                </>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Citas;
