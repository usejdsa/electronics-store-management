import { useEffect, useState } from 'react';
import api from '../api/axios';

const empty = { customer_id: '', statusi: 'pending', totali: '', shenime: '' };
const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);

  const fetchOrders = () => api.get('/orders').then(res => setOrders(res.data)).catch(console.error);

  useEffect(() => {
    fetchOrders();
    api.get('/customers').then(res => setCustomers(res.data)).catch(console.error);
  }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      customer_id: Number(form.customer_id),
      statusi: form.statusi,
      totali: Number(form.totali) || 0,
      shenime: form.shenime || null,
    };
    const req = editId ? api.put(`/orders/${editId}`, payload) : api.post('/orders', payload);
    req.then(() => { setEditId(null); setForm(empty); fetchOrders(); }).catch(console.error);
  };

  const handleEdit = (o) => {
    setEditId(o.id);
    setForm({
      customer_id: o.customer_id || '',
      statusi: o.statusi || 'pending',
      totali: o.totali || '',
      shenime: o.shenime || '',
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this order?')) return;
    api.delete(`/orders/${id}`).then(fetchOrders).catch(console.error);
  };

  return (
    <div>
      <h2>Orders</h2>

      {editId && (
        <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, padding: '8px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
          <span>Editing order #{editId}</span>
          <button onClick={() => { setEditId(null); setForm(empty); }} style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', textDecoration: 'underline' }}>Cancel</button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <select required value={form.customer_id} onChange={set('customer_id')}>
          <option value="">Select Customer *</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.emri} {c.mbiemri}</option>)}
        </select>
        <select value={form.statusi} onChange={set('statusi')}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="number" step="0.01" placeholder="Total (totali)" value={form.totali} onChange={set('totali')} />
        <input placeholder="Notes (shenime)" value={form.shenime} onChange={set('shenime')} />
        <button type="submit" className="btn-add">{editId ? 'Update Order' : 'Add Order'}</button>
      </form>

      {orders.map(o => (
        <div key={o.id} className="list-row">
          <span>Order #{o.id} — {o.customer_emri} — <strong>{o.statusi}</strong> — {o.totali}€</span>
          <span>
            <button className="btn-edit" onClick={() => handleEdit(o)}>Edit</button>
            <button className="btn-delete" onClick={() => handleDelete(o.id)}>Delete</button>
          </span>
        </div>
      ))}
    </div>
  );
}

export default Orders;