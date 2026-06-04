import { lazy, Suspense } from 'react';
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

// Lazy-loaded components — ndahen në chunk të veçantë, ngarkohen vetëm kur nevojiten
const Products       = lazy(() => import('./components/Products'));
const Categories     = lazy(() => import('./components/Categories'));
const Customers      = lazy(() => import('./components/Customers'));
const Orders         = lazy(() => import('./components/Orders'));
const OrderDetails   = lazy(() => import('./components/OrderDetails'));
const Suppliers      = lazy(() => import('./components/Suppliers'));
const PurchaseOrders = lazy(() => import('./components/PurchaseOrders'));
const Inventory      = lazy(() => import('./components/Inventory'));
const Dashboard      = lazy(() => import('./pages/dashboard'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const ServiceRequests = lazy(() => import('./components/ServiceRequests'));
const ProductReviews  = lazy(() => import('./components/ProductReviews'));

// Loading fallback — shfaqet ndërkohë që chunk-u ngarkohet
function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 14 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ color: '#94a3b8', fontSize: 13 }}>Duke ngarkuar...</span>
    </div>
  );
}

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
    { to: '/dashboard',        label: t.dashboard,        show: can('view:dashboard') },
    { to: '/products',         label: t.products,         show: can('view:products') },
    { to: '/categories',       label: t.categories,       show: can('view:categories') },
    { to: '/customers',        label: t.customers,        show: can('view:customers') },
    { to: '/orders',           label: t.orders,           show: can('view:orders') },
    { to: '/order-details',    label: t.orderDetails,     show: can('view:order-details') },
    { to: '/suppliers',        label: t.suppliers,        show: can('view:suppliers') },
    { to: '/purchase-orders',  label: t.purchaseOrders,   show: can('view:purchase-orders') },
    { to: '/inventory',        label: t.inventory,        show: can('view:inventory') },
    { to: '/service-requests', label: t.serviceRequests,  show: can('view:service-requests') },
    { to: '/product-reviews',  label: t.productReviews,   show: can('view:product-reviews') },
    { to: '/users',            label: t.userManagement,   show: isAdmin },
    { to: '/home',             label: t.customerView,     show: true },
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
        {/* Suspense kap lazy components dhe shfaq PageLoader ndërkohë */}
        <Suspense fallback={<PageLoader />}>
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
            {/* ── Route-t që mungonin në sidebar ── */}
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
        </Suspense>
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

      <Route path="/home" element={
        <ProtectedRoute>
          <CustomerHome />
        </ProtectedRoute>
      } />

      <Route path="/*" element={
        <ProtectedRoute>
          {isStaff ? <StaffLayout /> : <Navigate to="/home" replace />}
        </ProtectedRoute>
      } />

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