import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Plus, DollarSign, Clock, Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Servicio {
  id_servicio: number;
  nombre: string;
  descripcion: string;
  precio: number;
  tiempo_estimado: number;
  activo: boolean;
}

// Datos locales por si no hay conexión a Supabase
const serviciosDefault: Servicio[] = [
  { id_servicio: 1, nombre: 'Mini Split Convencional', descripcion: 'Mantenimiento de mini split convencional', precio: 500, tiempo_estimado: 60, activo: true },
  { id_servicio: 2, nombre: 'Mini Split Inverter', descripcion: 'Mantenimiento de mini split inverter', precio: 600, tiempo_estimado: 60, activo: true },
  { id_servicio: 3, nombre: 'Instalación Mini Split Convencional', descripcion: 'Instalación completa de mini split convencional', precio: 1200, tiempo_estimado: 180, activo: true },
  { id_servicio: 4, nombre: 'Instalación Mini Split Inverter', descripcion: 'Instalación completa de mini split inverter', precio: 1500, tiempo_estimado: 180, activo: true },
];

function Servicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [formNombre, setFormNombre] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formPrecio, setFormPrecio] = useState('');
  const [formTiempo, setFormTiempo] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const { data, error } = await supabase
        .from('servicio')
        .select('*')
        .eq('activo', true)
        .order('nombre');

      if (error) {
        console.error('Error al cargar servicios:', error);
        // Usar datos por defecto si hay error
        setServicios(serviciosDefault);
      } else if (data && data.length > 0) {
        setServicios(data);
      } else {
        // Si no hay datos en la BD, usar los por defecto
        setServicios(serviciosDefault);
      }
    } catch (err) {
      console.error('Error:', err);
      setServicios(serviciosDefault);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const calcularConIVA = (precio: number) => {
    return precio * 1.16;
  };

  const formatTiempo = (minutos: number) => {
    if (minutos >= 60) {
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
    }
    return `${minutos} min`;
  };

  const serviciosFiltrados = servicios.filter(s =>
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormNombre('');
    setFormDescripcion('');
    setFormPrecio('');
    setFormTiempo('');
  };

  const openCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  const closeCreate = () => {
    if (isSaving) return;
    setIsCreating(false);
    resetForm();
  };

  const handleCreateServicio = async () => {
    if (!formNombre || !formPrecio || !formTiempo) return;

    const precio = Number(formPrecio);
    const tiempo = Number(formTiempo);
    if (Number.isNaN(precio) || Number.isNaN(tiempo)) return;

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('servicio')
        .insert({
          nombre: formNombre,
          descripcion: formDescripcion,
          precio,
          tiempo_estimado: tiempo,
          activo: true
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error creando servicio:', error);
        return;
      }

      if (data) {
        setServicios(prev =>
          [...prev, data as Servicio].sort((a, b) => a.nombre.localeCompare(b.nombre))
        );
      } else {
        fetchServicios();
      }

      setIsCreating(false);
      resetForm();
    } catch (err) {
      console.error('Error inesperado creando servicio:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 text-slate-900 dark:text-slate-100"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white dark:bg-slate-100 dark:text-slate-900">
              <Wrench size={20} />
            </div>
            Catálogo de Servicios
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Administra los servicios de Aires Acondicionados</p>
        </div>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98, y: 0 }}
            onClick={openCreate}
            className="flex items-center gap-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-slate-900/30 dark:shadow-slate-100/30 hover:shadow-xl transition-all"
          >
            <Plus size={18} />
            Nuevo Servicio
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
            onClick={closeCreate}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="w-full max-w-md mx-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center">
                    <Wrench size={16} />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    Nuevo servicio
                  </span>
                </div>
                <button
                  onClick={closeCreate}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-3 mt-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Nombre</label>
                  <input
                    type="text"
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 dark:focus:ring-slate-100/20 dark:focus:border-slate-100"
                    placeholder="Nombre del servicio"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Descripción</label>
                  <textarea
                    value={formDescripcion}
                    onChange={(e) => setFormDescripcion(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 dark:focus:ring-slate-100/20 dark:focus:border-slate-100 resize-none"
                    placeholder="Descripción breve"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Precio (MXN)</label>
                    <input
                      type="number"
                      min="0"
                      value={formPrecio}
                      onChange={(e) => setFormPrecio(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 dark:focus:ring-slate-100/20 dark:focus:border-slate-100"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Tiempo (min)</label>
                    <input
                      type="number"
                      min="0"
                      value={formTiempo}
                      onChange={(e) => setFormTiempo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 dark:focus:ring-slate-100/20 dark:focus:border-slate-100"
                      placeholder="60"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  onClick={closeCreate}
                  className="px-4 py-2 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateServicio}
                  disabled={isSaving || !formNombre || !formPrecio || !formTiempo}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md transition-all ${
                    (isSaving || !formNombre || !formPrecio || !formTiempo) ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg'
                  }`}
                >
                  {isSaving ? 'Guardando...' : 'Guardar servicio'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Buscar servicios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 dark:focus:ring-slate-100/20 dark:focus:border-slate-100 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100"
        />
      </div>

      {/* Tabla de Servicios */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
            <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-900/20 border-t-slate-900 dark:border-slate-100/20 dark:border-t-slate-100 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-300">Servicio</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-300">Descripción</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign size={14} />
                      Precio
                    </div>
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-300">Precio + IVA</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-center gap-1">
                      <Clock size={14} />
                      Tiempo Est.
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {serviciosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-500 dark:text-slate-400">
                      No se encontraron servicios
                    </td>
                  </tr>
                ) : (
                  serviciosFiltrados.map((servicio, index) => (
                    <motion.tr
                      key={servicio.id_servicio}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white dark:bg-slate-100 dark:text-slate-900 group-hover:scale-110 transition-transform">
                            <Wrench size={18} />
                          </div>
                          <span className="font-medium text-slate-800 dark:text-slate-100">{servicio.nombre}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-slate-500 dark:text-slate-400 text-sm">{servicio.descripcion || '-'}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                          {formatCurrency(servicio.precio)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-lg">
                          {formatCurrency(calcularConIVA(servicio.precio))}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-sm">
                          {formatTiempo(servicio.tiempo_estimado)}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Nota de IVA */}
      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/40 rounded-xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-300 shrink-0">
          <DollarSign size={16} />
        </div>
        <div>
          <p className="text-amber-800 dark:text-amber-200 font-medium">Nota sobre precios</p>
          <p className="text-amber-700 dark:text-amber-300 text-sm">Los precios mostrados en la columna "Precio + IVA" incluyen el 16% de IVA.</p>
        </div>
      </div>
    </motion.div>
  );
}

export default Servicios;
