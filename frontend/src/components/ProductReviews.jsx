import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';

const STARS = [1, 2, 3, 4, 5];
const inp = { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 };
const label = { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 };

function StarRating({ value }) {
  return (
    <span>
      {STARS.map(s => (
        <span key={s} style={{ color: s <= value ? '#f59e0b' : '#e2e8f0', fontSize: 16 }}>★</span>
      ))}
    </span>
  );
}

function ProductReviews() {
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState('');
  const { isAdmin } = useRole();

  const fetchReviews = () =>
    api.get('/product-reviews').then(r => setReviews(r.data)).catch(console.error);

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Fshi këtë vlerësim?')) return;
    api.delete(`/product-reviews/${id}`).then(fetchReviews).catch(console.error);
  };

  const filtered = filterRating ? reviews.filter(r => r.vleresimi === Number(filterRating)) : reviews;

  const avg = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.vleresimi, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Product Reviews</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>
            {reviews.length} vlerësime · mesatarja {avg} ★
          </p>
        </div>
      </div>

      {/* Filter by stars */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['', '5', '4', '3', '2', '1'].map(s => {
          const active = filterRating === s;
          return (
            <button key={s} onClick={() => setFilterRating(s)}
              style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${active ? '#4f46e5' : '#e2e8f0'}`, background: active ? '#4f46e5' : 'white', color: active ? 'white' : '#64748b', fontSize: 12, fontWeight: active ? 700 : 400, cursor: 'pointer' }}>
              {s ? `${s} ★` : 'Të gjitha'}
            </button>
          );
        })}
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['ID', 'Produkti', 'Klienti', 'Vlerësimi', 'Komenti', 'Data', isAdmin ? 'Veprimet' : null].filter(Boolean).map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={isAdmin ? 7 : 6} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Nuk ka vlerësime</td></tr>
            ) : filtered.map(r => (
              <tr key={r.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13 }}>#{r.id}</td>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0f172a' }}>{r.produkt_emri || '—'}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{r.customer_emri || '—'}</td>
                <td style={{ padding: '12px 16px' }}><StarRating value={r.vleresimi} /></td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13, maxWidth: 260 }}>{r.komenti || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>pa koment</span>}</td>
                <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13 }}>{new Date(r.data_vleresimit).toLocaleDateString('sq-AL')}</td>
                {isAdmin && (
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleDelete(r.id)}
                      style={{ padding: '4px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#dc2626', fontSize: 12, cursor: 'pointer' }}>
                      Fshi
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductReviews;