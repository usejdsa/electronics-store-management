import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

// Existing CRUD components (unchanged for now)
import Products from './components/Products';
import Categories from './components/Categories';
import Customers from './components/Customers';
import Orders from './components/Orders';
import OrderDetails from './components/OrderDetails';
import Suppliers from './components/Suppliers';
import PurchaseOrders from './components/PurchaseOrders';
import Inventory from './components/Inventory';
import Dashboard from './pages/Dashboard';


// Nav link style helper
const navClass = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

function Sidebar() {
  const { user, logout } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/products',       label: 'Products' },
    { to: '/categories',     label: 'Categories' },
    { to: '/customers',      label: 'Customers' },
    { to: '/orders',         label: 'Orders' },
    { to: '/order-details',  label: 'Order Details' },
    { to: '/suppliers',      label: 'Suppliers' },
    { to: '/purchase-orders',label: 'Purchase Orders' },
    { to: '/inventory',      label: 'Inventory' },
  ];

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-200">
        <span className="font-semibold text-slate-800 text-base">⚡ ElectroStore</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label }) => (
          <NavLink key={to} to={to} className={navClass}>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 mb-1">Logged in as</p>
        <p className="text-sm font-medium text-slate-700 truncate">
          {user?.emri} {user?.mbiemri}
        </p>
        <p className="text-xs text-slate-400 mb-3">{user?.roles?.join(', ')}</p>
        <button
          onClick={logout}
          className="w-full text-sm text-red-600 hover:text-red-700 font-medium
                     px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products"        element={<Products />} />
          <Route path="/categories"      element={<Categories />} />
          <Route path="/customers"       element={<Customers />} />
          <Route path="/orders"          element={<Orders />} />
          <Route path="/order-details"   element={<OrderDetails />} />
          <Route path="/suppliers"       element={<Suppliers />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/inventory"       element={<Inventory />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;