import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/icono.png';
import { supabase } from '../lib/supabase';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Autenticación con Supabase (Nombre de usuario O Correo)
      const { data, error: dbError } = await supabase
        .from('USUARIO')
        .select('*')
        .or(`nombre.ilike.${username},correo.ilike.${username}`) // Busca coincidencia en nombre O correo
        .eq('contrasena', password)
        .maybeSingle(); // Usamos maybeSingle para manejar mejor el caso de no encontrado sin lanzar error inmediato
      
      if (dbError) {
        console.error("Error de Supabase:", dbError.message);
        throw new Error(dbError.message);
      }

      if (!data) {
        throw new Error('Credenciales incorrectas');
      }

      // Login exitoso
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', data.rol || 'usuario');
      localStorage.setItem('userName', data.nombre);
      localStorage.setItem('userEmail', data.correo || 'Sin correo'); // Guardar correo para mostrarlo
      
      console.log(`Login exitoso como ${data.nombre}`);
      navigate('/dashboard');

    } catch (err) {
      setError('Usuario o contraseña incorrectos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      
      {/* SECCIÓN IZQUIERDA - Branding y Animación Fluida */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900 items-center justify-center">
        {/* Fondos animados fluidos (Aurora Effect) */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-900 blur-[100px] opacity-40"
        />
        <motion.div 
          animate={{ 
            x: [-50, 50, -50],
            y: [-50, 50, -50],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-full h-full bg-gradient-to-tl from-cyan-500/20 to-transparent blur-3xl"
        />

        {/* Contenido sobrepuesto */}
        <div className="relative z-10 p-12 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl p-3 mb-6 border border-white/20 shadow-xl">
              <img src={logo} alt="FMSS" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight leading-tight">
              Gestión Inteligente <br/>
              <span className="text-blue-400">para tu Negocio</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Administra citas, clientes y servicios de mantenimiento con la eficiencia que FMSS te ofrece. Todo en un solo lugar.
            </p>
          </motion.div>

          {/* Lista de características */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            {[
              "Control total de citas y agenda",
              "Facturación simplificada",
              "Seguimiento de clientes"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <div className="p-1 bg-green-500/20 rounded-full text-green-400">
                  <CheckCircle2 size={16} />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Patrón de grid sutil */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
      </div>

      {/* SECCIÓN DERECHA - Formulario de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50/50">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-slate-100"
        >
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido</h2>
            <p className="text-slate-500">Ingresa tus credenciales para acceder al sistema.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 text-red-600 text-sm p-4 rounded-xl flex items-center gap-2 border border-red-100"
              >
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Correo o Usuario</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  placeholder="ejemplo@correo.com o usuario"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer hover:text-slate-900">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                Recordarme
              </label>
              <a href="#" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            ¿No tienes acceso?{' '}
            <a href="#" className="text-blue-600 font-semibold hover:underline">
              Contacta a soporte
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
