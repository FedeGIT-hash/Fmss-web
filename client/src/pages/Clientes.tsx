import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Calendar, Pencil, Trash2, X, Save, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ClienteResumen {
  nombre: string;
  totalCitas: number;
  ultimaFecha: string | null;
  telefono?: string | null;
  domicilio?: string | null;
}

function Clientes() {
  const [clientes, setClientes] = useState<ClienteResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para edición
  const [editingCliente, setEditingCliente] = useState<ClienteResumen | null>(null);
  const [editForm, setEditForm] = useState({ nombre: '', telefono: '', domicilio: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Estados para eliminación
  const [deletingCliente, setDeletingCliente] = useState<ClienteResumen | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

      const map = new Map<string, { total: number; ultima: string | null; telefono?: string | null; domicilio?: string | null }>();

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

      try {
        const raw = localStorage.getItem('clientes_contacto');
        const store = raw ? JSON.parse(raw) : {};
        Object.entries(store).forEach(([nombre, info]) => {
          const existing = map.get(nombre);
          if (existing) {
            map.set(nombre, {
              ...existing,
              telefono: (info as any).telefono ?? existing.telefono ?? null,
              domicilio: (info as any).domicilio ?? existing.domicilio ?? null
            });
          } else {
            // Si queremos mostrar clientes que solo tienen contacto pero no citas, descomentar:
            /*
            map.set(nombre, {
              total: 0,
              ultima: null,
              telefono: (info as any).telefono ?? null,
              domicilio: (info as any).domicilio ?? null
            });
            */
          }
        });
      } catch {}

      const list: ClienteResumen[] = Array.from(map.entries())
        .map(([nombre, value]) => ({
          nombre,
          totalCitas: value.total,
          ultimaFecha: value.ultima,
          telefono: value.telefono ?? null,
          domicilio: value.domicilio ?? null
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

  useEffect(() => {
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

  const handleEditClick = (cliente: ClienteResumen) => {
    setEditingCliente(cliente);
    setEditForm({
      nombre: cliente.nombre,
      telefono: cliente.telefono || '',
      domicilio: cliente.domicilio || ''
    });
  };

  const closeEditModal = () => {
    setEditingCliente(null);
    setEditForm({ nombre: '', telefono: '', domicilio: '' });
  };

  const handleSaveEdit = async () => {
    if (!editingCliente) return;
    setIsSaving(true);

    try {
      const oldName = editingCliente.nombre;
      const newName = editForm.nombre.trim();
      const newPhone = editForm.telefono.trim();
      const newAddress = editForm.domicilio.trim();

      if (!newName) {
        alert('El nombre del cliente no puede estar vacío');
        setIsSaving(false);
        return;
      }

      // 1. Si cambió el nombre, actualizar en Supabase (todas las citas)
      if (newName !== oldName) {
        const { error } = await supabase
          .from('cita_ui')
          .update({ cliente: newName })
          .eq('cliente', oldName);

        if (error) {
          console.error('Error actualizando nombre de cliente:', error);
          alert('Error al actualizar el nombre del cliente en la base de datos');
          setIsSaving(false);
          return;
        }
      }

      // 2. Actualizar localStorage (contacto)
      try {
        const raw = localStorage.getItem('clientes_contacto');
        const store = raw ? JSON.parse(raw) : {};

        // Si cambió el nombre, borrar la entrada vieja
        if (newName !== oldName && store[oldName]) {
          delete store[oldName];
        }

        store[newName] = {
          telefono: newPhone || null,
          domicilio: newAddress || null,
          updatedAt: new Date().toISOString()
        };

        localStorage.setItem('clientes_contacto', JSON.stringify(store));
      } catch (e) {
        console.error('Error guardando contacto local:', e);
      }

      // Recargar lista
      await loadClientes();
      closeEditModal();

    } catch (e) {
      console.error('Error guardando edición de cliente:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (cliente: ClienteResumen) => {
    setDeletingCliente(cliente);
  };

  const closeDeleteModal = () => {
    setDeletingCliente(null);
  };

  const confirmDelete = async () => {
    if (!deletingCliente) return;
    setIsDeleting(true);

    try {
      // 1. Eliminar citas de Supabase
      const { error } = await supabase
        .from('cita_ui')
        .delete()
        .eq('cliente', deletingCliente.nombre);

      if (error) {
        console.error('Error eliminando citas del cliente:', error);
        alert('Error al eliminar las citas del cliente');
        setIsDeleting(false);
        return;
      }

      // 2. Eliminar contacto de localStorage
      try {
        const raw = localStorage.getItem('clientes_contacto');
        if (raw) {
          const store = JSON.parse(raw);
          if (store[deletingCliente.nombre]) {
            delete store[deletingCliente.nombre];
            localStorage.setItem('clientes_contacto', JSON.stringify(store));
          }
        }
      } catch {}

      // Recargar lista
      await loadClientes();
      closeDeleteModal();

    } catch (e) {
      console.error('Error eliminando cliente:', e);
    } finally {
      setIsDeleting(false);
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
                className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-slate-900 dark:text-slate-50 text-lg">
                      {cliente.nombre}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
                      {cliente.totalCitas} {cliente.totalCitas === 1 ? 'cita' : 'citas'}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      <span>Última:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {formatFecha(cliente.ultimaFecha)}
                      </span>
                    </div>
                    {cliente.telefono && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Tel:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-200">{cliente.telefono}</span>
                      </div>
                    )}
                    {cliente.domicilio && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Dom:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-200">{cliente.domicilio}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditClick(cliente)}
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors"
                    title="Editar cliente"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(cliente)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
                    title="Eliminar cliente"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Editar */}
      <AnimatePresence>
        {editingCliente && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeEditModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Pencil size={20} className="text-blue-500" />
                  Editar Cliente
                </h3>
                <button
                  onClick={closeEditModal}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    value={editForm.nombre}
                    onChange={(e) => setEditForm(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="Nombre completo"
                  />
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-500 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    Cambiar el nombre actualizará todo su historial de citas.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={editForm.telefono}
                      onChange={(e) => setEditForm(prev => ({ ...prev, telefono: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="Ej. 644 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Domicilio
                    </label>
                    <input
                      type="text"
                      value={editForm.domicilio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, domicilio: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="Ej. Col. Centro #123"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2 shadow-sm shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Guardar cambios
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Eliminar */}
      <AnimatePresence>
        {deletingCliente && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeDeleteModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-2">
                  <Trash2 size={32} />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    ¿Eliminar cliente?
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Estás a punto de eliminar a <span className="font-bold text-slate-800 dark:text-slate-200">{deletingCliente.nombre}</span>.
                  </p>
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-left">
                    <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                      <span>
                        Esta acción eliminará <strong>permanentemente</strong> todo el historial de citas y la información de contacto de este cliente. No se puede deshacer.
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex w-full gap-3 mt-4">
                  <button
                    onClick={closeDeleteModal}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors font-medium shadow-sm shadow-red-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      'Sí, eliminar'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>

  );
}

export default Clientes;
