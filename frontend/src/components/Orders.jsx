import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';

const empty = { customer_id: '', statusi: 'pending', totali: '', shenime: '' };
const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  pending:   { bg: '#fef9c3', color: '#a16207' },
  confirmed: { bg: '#dbeafe', color: '#1d4ed8' },
  shipped:   { bg: '#e0f2fe', color: '#0369a1' },
  delivered: { bg: '#dcfce7', color: '#15803d' },
  cancelled: { bg: '#fee2e2', color: '#dc2626' },
};

const SOURCE_COLORS = {
  store:     { bg: '#ede9fe', color: '#6d28d9' },
  dashboard: { bg: '#f1f5f9', color: '#475569' },
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const { can } = useRole();

  const canMutate = can('mutate:orders');
  const canDelete = can('delete:orders');

  const fetchOrders = () => api.get('/orders').then(res => setOrders(res.data)).catch(console.error);

  useEffect(() => {
    fetchOrders();
    api.get('/customers').then(res => setCustomers(res.data)).catch(console.error);
  }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { customer_id: Number(form.customer_id), statusi: form.statusi, totali: Number(form.totali) || 0, shenime: form.shenime || null };
    const req = editId ? api.put(`/orders/${editId}`, payload) : api.post('/orders', payload);
    req.then(() => { setEditId(null); setForm(empty); fetchOrders(); }).catch(console.error);
  };

  const handleEdit = (o) => {
    setEditId(o.id);
    setForm({ customer_id: o.customer_id ? String(o.customer_id) : '', statusi: o.statusi || 'pending', totali: o.totali ?? '', shenime: o.shenime || '' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this order?')) return;
    api.delete(`/orders/${id}`).then(fetchOrders).catch(console.error);
  };

  const handleStatusChange = (id, statusi) => {
    api.put(`/orders/${id}/status`, { statusi }).then(fetchOrders).catch(console.error);
  };

  const filtered = orders.filter(o =>
    (filterStatus ? o.statusi === filterStatus : true) &&
    (filterSource ? o.source === filterSource : true)
  );

  return (
    <div>
      <h2>Orders</h2>

      {canMutate && (
        <>
          {editId && (
            <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, padding: '8px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
              <span>Editing order #{editId}</span>
              <button onClick={() => { setEditId(null); setForm(empty); }} style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', textDecoration: 'underline' }}>Cancel</button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <select required value={form.customer_id} onChange={set('customer_id')}>
              <option value="">Select Customer *</option>
              {customers.map(c => <option key={c.id} value={String(c.id)}>{c.emri} {c.mbiemri}</option>)}
            </select>
            <select value={form.statusi} onChange={set('statusi')}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="number" step="0.01" placeholder="Total (totali)" value={form.totali} onChange={set('totali')} />
            <input placeholder="Notes (shenime)" value={form.shenime} onChange={set('shenime')} />
            <button type="submit" className="btn-add">{editId ? 'Update Order' : 'Add Order'}</button>
          </form>
        </>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}>
          <option value="">Të gjitha statuset</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterSource} onChange={e => setFilterSource(e.target.value)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}>
          <option value="">Të gjitha burimet</option>
          <option value="store">Online (store)</option>
          <option value="dashboard">Dashboard</option>
        </select>
        {(filterStatus || filterSource) && (
          <button onClick={() => { setFilterStatus(''); setFilterSource(''); }} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #fecaca', background: 'white', color: '#ef4444', fontSize: 13, cursor: 'pointer' }}>Pastro</button>
        )}
        <span style={{ fontSize: 13, color: '#64748b', alignSelf: 'center' }}>{filtered.length} porosi</span>
      </div>

      {filtered.map(o => {
        const sc = STATUS_COLORS[o.statusi] || { bg: '#f1f5f9', color: '#475569' };
        const src = SOURCE_COLORS[o.source] || SOURCE_COLORS.dashboard;
        return (
          <div key={o.id} className="list-row" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ minWidth: 70, fontWeight: 600 }}>Order #{o.id}</span>
            <span style={{ flex: 1, color: '#374151' }}>{o.customer_emri || '—'}</span>
            <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: src.bg, color: src.color }}>{o.source || 'dashboard'}</span>

            {canMutate ? (
              <select value={o.statusi} onChange={e => handleStatusChange(o.id, e.target.value)} style={{ padding: '3px 8px', borderRadius: 8, border: `1px solid ${sc.color}`, background: sc.bg, color: sc.color, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: sc.bg, color: sc.color }}>{o.statusi}</span>
            )}

            <span style={{ fontWeight: 700, color: '#0f172a' }}>{parseFloat(o.totali).toFixed(2)}€</span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{new Date(o.created_at).toLocaleDateString()}</span>
            <span>
              {canMutate && <button className="btn-edit" onClick={() => handleEdit(o)}>Edit</button>}
              {canDelete && <button className="btn-delete" onClick={() => handleDelete(o.id)}>Delete</button>}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default Orders;