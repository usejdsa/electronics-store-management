import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LangProvider, useLang } from './context/LangContext';
import { useRole } from './hooks/useRole';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import CustomerHome from './pages/CustomerHome';
import LightningIcon from './assets/lightning.svg';

import Products from './components/Products';
import Categories from './components/Categories';
import Customers from './components/Customers';
import Orders from './components/Orders';
import OrderDetails from './components/OrderDetails';
import Suppliers from './components/Suppliers';
import PurchaseOrders from './components/PurchaseOrders';
import Inventory from './components/Inventory';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ServiceRequests from './components/ServiceRequests';
import ProductReviews from './components/ProductReviews';

const navClass = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

function Sidebar() {
  const { user, logout } = useAuth();
  const { can, isAdmin } = useRole();

  const { t, lang, toggleLang } = useLang();
  const allLinks = [
    { to: '/dashboard',       label: t.dashboard,        show: can('view:dashboard') },
    { to: '/products',        label: t.products,         show: can('view:products') },
    { to: '/categories',      label: t.categories,       show: can('view:categories') },
    { to: '/customers',       label: t.customers,        show: can('view:customers') },
    { to: '/orders',          label: t.orders,           show: can('view:orders') },
    { to: '/order-details',   label: t.orderDetails,     show: can('view:order-details') },
    { to: '/suppliers',       label: t.suppliers,        show: can('view:suppliers') },
    { to: '/purchase-orders', label: t.purchaseOrders,   show: can('view:purchase-orders') },
    { to: '/inventory',       label: t.inventory,        show: can('view:inventory') },
    { to: '/users',           label: t.userManagement,   show: isAdmin },
    { to: '/home',            label: t.customerView,     show: true },
  ];

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      <div className="px-4 py-5 border-b border-slate-200">
        <span className="font-semibold text-slate-800 text-base flex items-center gap-2">
          <img src={LightningIcon} alt="" className="w-5 h-5" /> ElectroStore
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {allLinks.filter(l => l.show).map(({ to, label }) => (
          <NavLink key={to} to={to} className={navClass}>{label}</NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 mb-1">{t.loggedInAs}</p>
        <p className="text-sm font-medium text-slate-700 truncate">{user?.emri} {user?.mbiemri}</p>
        <p className="text-xs text-slate-400 mb-3">{user?.roles?.join(', ')}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <button
            onClick={toggleLang}
            className="text-xs font-bold px-2 py-1 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
            title="Switch language"
          >
            {lang === 'sq' ? '🇦🇱 SQ' : '🇬🇧 EN'}
          </button>
        </div>
        <button
          onClick={logout}
          className="w-full text-sm text-red-600 hover:text-red-700 font-medium
                     px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
        >
          {t.signOut}
        </button>
      </div>
    </aside>
  );
}

function StaffLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['Admin', 'Technician', 'Cashier']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute allowedRoles={['Admin', 'Technician', 'Cashier']}>
              <Products />
            </ProtectedRoute>
          } />
          <Route path="/categories" element={
            <ProtectedRoute allowedRoles={['Admin', 'Technician']}>
              <Categories />
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute allowedRoles={['Admin', 'Cashier']}>
              <Customers />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute allowedRoles={['Admin', 'Cashier']}>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/order-details" element={
            <ProtectedRoute allowedRoles={['Admin', 'Cashier']}>
              <OrderDetails />
            </ProtectedRoute>
          } />
          <Route path="/suppliers" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Suppliers />
            </ProtectedRoute>
          } />
          <Route path="/purchase-orders" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <PurchaseOrders />
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute allowedRoles={['Admin', 'Technician']}>
              <Inventory />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/service-requests" element={
            <ProtectedRoute allowedRoles={['Admin', 'Technician']}>
              <ServiceRequests />
            </ProtectedRoute>
          } />
          <Route path="/product-reviews" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <ProductReviews />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  const { isAdmin, isTechnician, isCashier } = useRole();
  const isStaff = isAdmin || isTechnician || isCashier;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* /home - e arritshme nga të gjithë (customer + staff) */}
      <Route path="/home" element={
        <ProtectedRoute>
          <CustomerHome />
        </ProtectedRoute>
      } />

      {/* Staff routes */}
      <Route path="/*" element={
        <ProtectedRoute>
          {isStaff ? <StaffLayout /> : <Navigate to="/home" replace />}
        </ProtectedRoute>
      } />

      {/* Redirect pas login — staff → /dashboard, customer → /home */}
      <Route path="/" element={
        user
          ? isStaff
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/home" replace />
          : <Navigate to="/login" replace />
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <LangProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </LangProvider>
    </AuthProvider>
  );
}

export default App;