import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Citas from './pages/Citas';
import Servicios from './pages/Servicios';
import Clientes from './pages/Clientes';
import Facturacion from './pages/Facturacion';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="citas" element={<Citas />} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="facturacion" element={<Facturacion />} />
        </Route>

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
