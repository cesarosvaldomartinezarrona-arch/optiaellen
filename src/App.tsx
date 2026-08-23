import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Panel from './pages/Panel';
import Clientes from './pages/Clientes';
import Recetas from './pages/Recetas';
import Ventas from './pages/Ventas';
import Cobrar from './pages/Cobrar';
import Entregar from './pages/Entregar';
import Laboratorio from './pages/Laboratorio';
import Gastos from './pages/Gastos';
import Inventario from './pages/Inventario';
import Configuracion from './pages/Configuracion';

function ProtectedRoute({ permission, children }: { permission: string; children: React.ReactNode }) {
  const { hasPermission, user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!hasPermission(permission)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route element={<Layout />}>
        <Route path="/" element={<ProtectedRoute permission="panel"><Panel /></ProtectedRoute>} />
        <Route path="/clientes" element={<ProtectedRoute permission="clientes"><Clientes /></ProtectedRoute>} />
        <Route path="/recetas" element={<ProtectedRoute permission="recetas"><Recetas /></ProtectedRoute>} />
        <Route path="/ventas" element={<ProtectedRoute permission="ventas"><Ventas /></ProtectedRoute>} />
        <Route path="/cobrar" element={<ProtectedRoute permission="cobrar"><Cobrar /></ProtectedRoute>} />
        <Route path="/entregar" element={<ProtectedRoute permission="entregar"><Entregar /></ProtectedRoute>} />
        <Route path="/inventario" element={<ProtectedRoute permission="inventario"><Inventario /></ProtectedRoute>} />
        <Route path="/laboratorio" element={<ProtectedRoute permission="laboratorio"><Laboratorio /></ProtectedRoute>} />
        <Route path="/gastos" element={<ProtectedRoute permission="gastos"><Gastos /></ProtectedRoute>} />
        <Route path="/configuracion" element={<ProtectedRoute permission="configuracion"><Configuracion /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </AppProvider>
  );
}
