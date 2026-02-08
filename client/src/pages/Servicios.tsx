import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Plus, DollarSign, Clock, Search } from 'lucide-react';
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

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const { data, error } = await supabase
        .from('SERVICIO')
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
              <Wrench size={20} />
            </div>
            Catálogo de Servicios
          </h1>
          <p className="text-slate-500 mt-1">Administra los servicios de Aires Acondicionados</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-orange-500/25 hover:shadow-xl transition-shadow"
        >
          <Plus size={18} />
          Nuevo Servicio
        </motion.button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Buscar servicios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
        />
      </div>

      {/* Tabla de Servicios */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Servicio</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Descripción</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-slate-600">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign size={14} />
                      Precio
                    </div>
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-slate-600">Precio + IVA</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-slate-600">
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
                    <td colSpan={5} className="text-center py-12 text-slate-500">
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
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                            <Wrench size={18} />
                          </div>
                          <span className="font-medium text-slate-800">{servicio.nombre}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-slate-500 text-sm">{servicio.descripcion || '-'}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-semibold text-slate-800">
                          {formatCurrency(servicio.precio)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                          {formatCurrency(calcularConIVA(servicio.precio))}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-slate-600 bg-slate-100 px-3 py-1 rounded-lg text-sm">
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
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 shrink-0">
          <DollarSign size={16} />
        </div>
        <div>
          <p className="text-amber-800 font-medium">Nota sobre precios</p>
          <p className="text-amber-700 text-sm">Los precios mostrados en la columna "Precio + IVA" incluyen el 16% de IVA.</p>
        </div>
      </div>
    </motion.div>
  );
}

export default Servicios;
