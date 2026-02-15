import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/icono.png';
import { supabase } from '../lib/supabase';
import RotatingText from '../components/RotatingText';

// Componente de partículas flotantes
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * 100 + '%',
            y: '110%',
            opacity: 0
          }}
          animate={{
            y: '-10%',
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
};

// Animaciones escalonadas
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
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
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 items-center justify-center">
        {/* Partículas flotantes */}
        <FloatingParticles />

        {/* Fondos animados fluidos (Aurora Effect Mejorado) */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-conic from-blue-600 via-purple-600 via-pink-500 to-blue-600 blur-[120px] opacity-40"
        />
        <motion.div
          animate={{
            x: [-80, 80, -80],
            y: [-80, 80, -80],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-full h-full bg-gradient-to-tl from-cyan-400/30 via-blue-500/20 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            x: [60, -60, 60],
            y: [40, -40, 40],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-gradient-to-tr from-indigo-600/30 via-violet-500/20 to-transparent blur-3xl"
        />

        {/* Contenido sobrepuesto */}
        <motion.div
          className="relative z-10 p-12 text-white max-w-lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <motion.div
              className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl p-2 mb-6 border border-white/20 shadow-2xl shadow-blue-500/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img src={logo} alt="FMSS" className="w-full h-full object-contain drop-shadow-lg rounded-xl" />
            </motion.div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight leading-tight">
              Gestión Inteligente <br />
              <div className="flex items-center gap-2 mt-2">
                <span>Para el</span>
                <RotatingText 
                  texts={['Negocio', 'Futuro', 'Éxito']} 
                  mainClassName="px-2 sm:px-2 md:px-3 bg-blue-600 text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg inline-flex shadow-lg shadow-blue-500/30"
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                  transition={{ type: "spring", damping: 30, stiffness: 200 }}
                  rotationInterval={2000}
                />
              </div>
            </h1>
            <p className="text-lg text-slate-300/90 leading-relaxed">
              Administra citas, clientes y servicios de mantenimiento con la eficiencia que FMSS te ofrece. Todo en un solo lugar.
            </p>
          </motion.div>


          <motion.div className="space-y-4">
            {[
              "Control total de citas y agenda",
              "Facturación simplificada",
              "Seguimiento de clientes"
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex items-center gap-3 text-slate-300 group"
                whileHover={{ x: 5 }}
              >
                <div className="p-1.5 bg-emerald-500/20 rounded-full text-emerald-400 group-hover:bg-emerald-500/30 transition-colors">
                  <CheckCircle2 size={16} />
                </div>
                <span className="group-hover:text-white transition-colors">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-soft-light"></div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-md bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/60 border border-slate-100/80 dark:border-slate-800"
        >
          <motion.div
            className="mb-8 text-center lg:text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Bienvenido</h2>
            <p className="text-slate-500 dark:text-slate-400">Ingresa tus credenciales para acceder al sistema.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-red-50 to-rose-50 text-red-600 text-sm p-4 rounded-xl flex items-center gap-3 border border-red-100 shadow-sm"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {error}
              </motion.div>
            )}

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="text-sm font-semibold text-slate-700 ml-1">Correo o Usuario</label>
              <div className={`relative group transition-all duration-300 ${focusedField === 'username' ? 'scale-[1.02]' : ''}`}>
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'username' ? 'text-blue-500' : 'text-slate-400'}`}>
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-slate-50/80 dark:bg-slate-900/60 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="ejemplo@correo.com o usuario"
                />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 pointer-events-none"
                  animate={{ opacity: focusedField === 'username' ? 0.5 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="text-sm font-semibold text-slate-700 ml-1">Contraseña</label>
              <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-blue-500' : 'text-slate-400'}`}>
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-slate-50/80 dark:bg-slate-900/60 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="••••••••"
                />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 pointer-events-none"
                  animate={{ opacity: focusedField === 'password' ? 0.5 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            <motion.div
              className="flex items-center justify-between text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-slate-100 transition-colors group">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-transform group-hover:scale-110" />
                Recordarme
              </label>
              <a href="#" className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white font-semibold py-4 rounded-xl shadow-xl shadow-slate-900/25 hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-600/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Iniciar Sesión
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </>
              )}
            </motion.button>
          </form>

            <motion.p
              className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            ¿No tienes acceso?{' '}
            <a href="#" className="text-blue-600 font-semibold hover:underline hover:text-blue-700 transition-colors">
              Contacta a soporte
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
