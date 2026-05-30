import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';
import Modal from './Modal';

const empty = { customer_id: '', statusi: 'pending', totali: '', shenime: '' };
const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = { pending: ['#fef9c3','#a16207'], confirmed: ['#dbeafe','#1d4ed8'], shipped: ['#e0f2fe','#0369a1'], delivered: ['#dcfce7','#15803d'], cancelled: ['#fee2e2','#dc2626'] };
const inp = { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 };
const label = { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 };

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const { can } = useRole();
  const canMutate = can('mutate:orders');
  const canDelete = can('delete:orders');

  const fetchOrders = () => api.get('/orders').then(res => setOrders(res.data)).catch(console.error);

  useEffect(() => {
    fetchOrders();
    api.get('/customers').then(res => setCustomers(res.data)).catch(console.error);
  }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const openAdd = () => { setEditId(null); setForm(empty); setModalOpen(true); };
  const openEdit = (o) => {
    setEditId(o.id);
    setForm({ customer_id: o.customer_id ? String(o.customer_id) : '', statusi: o.statusi || 'pending', totali: o.totali ?? '', shenime: o.shenime || '' });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditId(null); setForm(empty); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { customer_id: Number(form.customer_id), statusi: form.statusi, totali: Number(form.totali) || 0, shenime: form.shenime || null };
    const req = editId ? api.put(`/orders/${editId}`, payload) : api.post('/orders', payload);
    req.then(() => { closeModal(); fetchOrders(); }).catch(console.error);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Fshi këtë porosi?')) return;
    api.delete(`/orders/${id}`).then(fetchOrders).catch(console.error);
  };

  const handleStatusChange = (id, statusi) => {
    api.put(`/orders/${id}/status`, { statusi }).then(fetchOrders).catch(console.error);
  };

  const filtered = filterStatus ? orders.filter(o => o.statusi === filterStatus) : orders;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Porosite</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{orders.length} porosi gjithsej</p>
        </div>
        {canMutate && (
          <button onClick={openAdd} style={{ padding: '9px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            + Shto Porosi
          </button>
        )}
      </div>

      {/* Filtrat */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['', ...STATUSES].map(s => {
          const active = filterStatus === s;
          const [bg, color] = s ? (STATUS_COLORS[s] || ['#f1f5f9','#475569']) : ['#4f46e5','white'];
          return (
            <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${active ? (s ? color : '#4f46e5') : '#e2e8f0'}`, background: active ? (s ? bg : '#4f46e5') : 'white', color: active ? (s ? color : 'white') : '#64748b', fontSize: 12, fontWeight: active ? 700 : 400, cursor: 'pointer' }}>
              {s || 'Të gjitha'} {s && `(${orders.filter(o => o.statusi === s).length})`}
            </button>
          );
        })}
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['ID', 'Klienti', 'Statusi', 'Totali', 'Data', 'Veprimet'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Nuk ka porosi</td></tr>
            ) : filtered.map(o => {
              const [bg, color] = STATUS_COLORS[o.statusi] || ['#f1f5f9','#475569'];
              return (
                <tr key={o.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13 }}>#{o.id}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0f172a' }}>{o.customer_emri || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {canMutate ? (
                      <select value={o.statusi} onChange={e => handleStatusChange(o.id, e.target.value)} style={{ padding: '3px 8px', borderRadius: 8, border: `1px solid ${color}`, background: bg, color, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: bg, color }}>{o.statusi}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>{parseFloat(o.totali || 0).toFixed(2)}€</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13 }}>{new Date(o.created_at).toLocaleDateString('sq-AL')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {canMutate && <button onClick={() => openEdit(o)} style={{ padding: '4px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, color: '#1d4ed8', fontSize: 12, cursor: 'pointer', marginRight: 6 }}>Ndrysho</button>}
                    {canDelete && <button onClick={() => handleDelete(o.id)} style={{ padding: '4px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#dc2626', fontSize: 12, cursor: 'pointer' }}>Fshi</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editId ? 'Ndrysho Porosinë' : 'Shto Porosi të Re'}>
        <form onSubmit={handleSubmit}>
          <div>
            <label style={label}>Klienti *</label>
            <select required style={inp} value={form.customer_id} onChange={set('customer_id')}>
              <option value="">Zgjidh Klientin</option>
              {customers.map(c => <option key={c.id} value={String(c.id)}>{c.emri} {c.mbiemri}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Statusi</label>
            <select style={inp} value={form.statusi} onChange={set('statusi')}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><label style={label}>Totali (€)</label><input type="number" step="0.01" style={inp} value={form.totali} onChange={set('totali')} placeholder="0.00" /></div>
          <div><label style={label}>Shënime</label><textarea style={{ ...inp, minHeight: 72, resize: 'vertical' }} value={form.shenime} onChange={set('shenime')} placeholder="Shënime shtesë..." /></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{ flex: 1, padding: 11, background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              {editId ? 'Ruaj Ndryshimet' : 'Shto Porosinë'}
            </button>
            <button type="button" onClick={closeModal} style={{ padding: '11px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, color: '#64748b', fontSize: 14, cursor: 'pointer' }}>Anulo</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Orders;