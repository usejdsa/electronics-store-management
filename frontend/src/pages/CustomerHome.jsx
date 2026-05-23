import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../hooks/useRole';

function CustomerHome() {
  const { user, logout } = useAuth();
  const { isAdmin, isTechnician, isCashier } = useRole();
  const navigate = useNavigate();

  const hasStaffAccess = isAdmin || isTechnician || isCashier;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full max-w-sm p-8 text-center">

        <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-slate-800 mb-1">
          Welcome, {user?.emri}
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          {user?.roles?.join(', ')}
        </p>

        {hasStaffAccess && (
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium
                       hover:bg-indigo-700 transition-colors mb-3"
          >
            Go to Dashboard
          </button>
        )}

        <button
          onClick={logout}
          className="w-full py-2.5 rounded-lg text-sm font-medium border border-red-200
                     text-red-600 hover:bg-red-50 transition-colors"
        >
          Sign out
        </button>

      </div>
    </div>
  );
}

export default CustomerHome;