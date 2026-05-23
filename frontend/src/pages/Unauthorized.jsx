import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full max-w-md p-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-2xl mb-5">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-slate-800 mb-2">Access Denied</h1>
        <p className="text-slate-500 text-sm mb-1">
          You don't have permission to view this page.
        </p>
        <p className="text-slate-400 text-xs mb-8">
          Logged in as: <span className="font-medium text-slate-500">{user?.roles?.join(', ')}</span>
        </p>
        <button
          onClick={() => navigate(-1)}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default Unauthorized;