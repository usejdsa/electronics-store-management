import { useEffect, useState } from 'react';
import api from '../api/axios';

function StatCard({ label, value, icon, bg, color, sub }) {
  return (
    <div style={{ background: 'white', borderRadius: '14px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
      <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: '12px', color, marginTop: '4px', fontWeight: '500' }}>{sub}</div>}
      </div>
    </div>
  );
}

function BarChart({ data }) {
  if (!data || data.length === 0) return <div style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>Nuk ka të dhëna</div>;
  const max = Math.max(...data.map(d => Number(d.revenue)));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '140px', padding: '0 8px' }}>
      {data.map((d, i) => {
        const h = max > 0 ? (Number(d.revenue) / max) * 120 : 0;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{Number(d.revenue).toLocaleString()}€</div>
            <div style={{ width: '100%', height: `${h}px`, minHeight: '4px', background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)', borderRadius: '4px 4px 0 0' }} />
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{d.muaji?.slice(5)}</div>
          </div>
        );
      })}
    </div>
  );
}

const statusMap = {
  pending:   ['#fef9c3','#a16207'],
  confirmed: ['#dbeafe','#1d4ed8'],
  shipped:   ['#ede9fe','#6d28d9'],
  delivered: ['#dcfce7','#15803d'],
  anuluar:   ['#fee2e2','#dc2626'],
};
function Badge({ text }) {
  const [bg, color] = statusMap[text] || ['#f1f5f9','#64748b'];
  return <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: bg, color }}>{text}</span>;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard')
      .then(r => setData(r.data))
      .catch(() => setError('Gabim gjatë ngarkimit të të dhënave.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '12px' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ color: '#94a3b8', fontSize: '14px' }}>Duke ngarkuar...</span>
    </div>
  );

  if (error) return (
    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '20px', color: '#dc2626' }}>{error}</div>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>Dashboard</h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          Pasqyra e sistemit — {new Date().toLocaleDateString('sq-AL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Rreshti 1 — 4 cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
        <StatCard label="Produktet"  value={data.totalProducts}  icon="📦" bg="#dbeafe" color="#1d4ed8" sub="produkte aktive" />
        <StatCard label="Klientët"   value={data.totalCustomers} icon="👥" bg="#dcfce7" color="#15803d" sub="të regjistruar" />
        <StatCard label="Porosite"   value={data.totalOrders}    icon="🛒" bg="#fef9c3" color="#a16207" sub="gjithsej" />
        <StatCard label="Furnitorët" value={data.totalSuppliers} icon="🏭" bg="#ede9fe" color="#6d28d9" sub="partnerë" />
      </div>

      {/* Rreshti 2 — 4 cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Të Ardhurat"    value={`${Number(data.totalRevenue).toLocaleString()}€`} icon="💰" bg="#dcfce7" color="#15803d" sub="porosi të konfirmuara" />
        <StatCard label="Stok i Ulët"    value={data.lowStock}         icon="⚠️" bg="#fef9c3" color="#a16207" sub="produkte nën 5 copë" />
        <StatCard label="Garanci Aktive" value={data.activeWarranties} icon="🛡️" bg="#dbeafe" color="#1d4ed8" sub="në fuqi" />
        <StatCard label="Servise Hapur"  value={data.openServices}     icon="🔧" bg="#fee2e2" color="#dc2626" sub="kërkesa të hapura" />
      </div>

      {/* Grafik + Statusi */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>Të Ardhurat — 6 Muajt e Fundit</h2>
          <BarChart data={data.revenueByMonth} />
        </div>
        <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>Statusi Porosive</h2>
          {!data.ordersByStatus?.length
            ? <p style={{ color: '#94a3b8', fontSize: '14px' }}>Nuk ka porosi</p>
            : data.ordersByStatus.map(s => (
              <div key={s.statusi} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <Badge text={s.statusi} />
                <span style={{ fontWeight: '600', fontSize: '15px', color: '#0f172a' }}>{s.total}</span>
              </div>
            ))
          }
        </div>
      </div>

      {/* Porosite e fundit + Top produktet */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f8fafc' }}>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>Porosite e Fundit</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f8fafc' }}>
              {['ID','Klienti','Totali','Statusi','Data'].map(h => (
                <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {!data.recentOrders?.length
                ? <tr><td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Nuk ka porosi</td></tr>
                : data.recentOrders.map(o => (
                  <tr key={o.id} style={{ borderTop: '1px solid #f8fafc' }}>
                    <td style={{ padding: '13px 20px', color: '#94a3b8', fontSize: '13px' }}>#{o.id}</td>
                    <td style={{ padding: '13px 20px', fontWeight: '500', color: '#0f172a', fontSize: '14px' }}>{o.customer_emri || '—'}</td>
                    <td style={{ padding: '13px 20px', fontWeight: '600', color: '#0f172a' }}>{Number(o.totali).toLocaleString()}€</td>
                    <td style={{ padding: '13px 20px' }}><Badge text={o.statusi} /></td>
                    <td style={{ padding: '13px 20px', color: '#94a3b8', fontSize: '13px' }}>{new Date(o.created_at).toLocaleDateString('sq-AL')}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>Top 5 Produktet</h2>
          {!data.topProducts?.length
            ? <p style={{ color: '#94a3b8', fontSize: '14px' }}>Nuk ka të dhëna</p>
            : data.topProducts.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: ['#dbeafe','#dcfce7','#fef9c3','#ede9fe','#fee2e2'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: ['#1d4ed8','#15803d','#a16207','#6d28d9','#dc2626'][i], flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.emri}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>{p.total_shitur} copë të shitura</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  );
}