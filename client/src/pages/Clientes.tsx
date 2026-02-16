import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ClienteResumen {
  nombre: string;
  totalCitas: number;
  ultimaFecha: string | null;
}

function Clientes() {
  const [clientes, setClientes] = useState<ClienteResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadClientes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cita_ui')
          .select('cliente, fecha');

        if (error) {
          console.error('Error cargando clientes desde Supabase:', error);
          setClientes([]);
          return;
        }

        if (!data) {
          setClientes([]);
          return;
        }

        const map = new Map<string, { total: number; ultima: string | null }>();

        (data as any[]).forEach((row) => {
          const nombreRaw = (row.cliente || '').trim();
          if (!nombreRaw) return;
          const fecha = row.fecha as string | null;
          const existing = map.get(nombreRaw);
          if (!existing) {
            map.set(nombreRaw, { total: 1, ultima: fecha || null });
          } else {
            const total = existing.total + 1;
            let ultima = existing.ultima;
            if (fecha && (!ultima || fecha > ultima)) {
              ultima = fecha;
            }
            map.set(nombreRaw, { total, ultima });
          }
        });

        const list: ClienteResumen[] = Array.from(map.entries())
          .map(([nombre, value]) => ({
            nombre,
            totalCitas: value.total,
            ultimaFecha: value.ultima
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));

        setClientes(list);
      } catch (e) {
        console.error('Error inesperado cargando clientes desde Supabase', e);
        setClientes([]);
      } finally {
        setLoading(false);
      }
    };

    loadClientes();
  }, []);

  const clientesFiltrados = useMemo(
    () =>
      clientes.filter((c) =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [clientes, searchTerm]
  );

  const formatFecha = (value: string | null) => {
    if (!value) return 'Sin citas';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return format(date, "d 'de' MMMM yyyy", { locale: es });
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
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
              <Users size={20} />
            </div>
            Directorio de Clientes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Clientes que han generado citas en tu agenda.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400">
            Cargando clientes...
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400">
            No hay clientes registrados todavía.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {clientesFiltrados.map((cliente) => (
              <div
                key={cliente.nombre}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-50">
                    {cliente.nombre}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {cliente.totalCitas} {cliente.totalCitas === 1 ? 'cita registrada' : 'citas registradas'}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-slate-400" />
                    <span>Última cita:</span>
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {formatFecha(cliente.ultimaFecha)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Clientes;
