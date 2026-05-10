import { useEffect, useState } from 'react';
import api from '../api/axios';

function OrderDetails() {
  const [details, setDetails] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ order_id: '', product_id: '', sasia: '', cmimi_unit: '', zbritja: '' });

  const fetchDetails = () => api.get('/order-details').then(res => setDetails(res.data)).catch(console.error);

  useEffect(() => {
    fetchDetails();
    api.get('/orders').then(res => setOrders(res.data)).catch(console.error);
    api.get('/products').then(res => setProducts(res.data)).catch(console.error);
  }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { order_id: Number(form.order_id), product_id: Number(form.product_id), sasia: Number(form.sasia), cmimi_unit: Number(form.cmimi_unit), zbritja: form.zbritja ? Number(form.zbritja) : 0 };
    const req = editId ? api.put(`/order-details/${editId}`, payload) : api.post('/order-details', payload);
    req.then(() => { setEditId(null); setForm({ order_id: '', product_id: '', sasia: '', cmimi_unit: '', zbritja: '' }); fetchDetails(); }).catch(console.error);
  };

  const handleEdit = (d) => {
    setEditId(d.id);
    setForm({ order_id: d.order_id || '', product_id: d.product_id || '', sasia: d.sasia || '', cmimi_unit: d.cmimi_unit || '', zbritja: d.zbritja || '' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this order detail?')) return;
    api.delete(`/order-details/${id}`).then(fetchDetails).catch(console.error);
  };

  return (
    <div>
      <h2>Order Details</h2>

      {editId && (
        <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, padding: '8px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
          <span>Editing detail #{editId}</span>
          <button onClick={() => { setEditId(null); setForm({ order_id: '', product_id: '', sasia: '', cmimi_unit: '', zbritja: '' }); }} style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', textDecoration: 'underline' }}>Cancel</button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <select required value={form.order_id} onChange={set('order_id')}>
          <option value="">Select Order *</option>
          {orders.map(o => <option key={o.id} value={o.id}>Order #{o.id} — {o.customer_emri}</option>)}
        </select>
        <select required value={form.product_id} onChange={set('product_id')}>
          <option value="">Select Product *</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.emri}</option>)}
        </select>
        <input required type="number" placeholder="Quantity *" value={form.sasia} onChange={set('sasia')} />
        <input required type="number" step="0.01" placeholder="Unit price *" value={form.cmimi_unit} onChange={set('cmimi_unit')} />
        <input type="number" step="0.01" placeholder="Discount" value={form.zbritja} onChange={set('zbritja')} />
        <button type="submit" className="btn-add">{editId ? 'Update Detail' : 'Add Detail'}</button>
      </form>

      {details.map(d => (
        <div key={d.id} className="list-row">
          <span>Order #{d.order_id} — Product #{d.product_id} — qty: {d.sasia} — {d.cmimi_unit}€/unit {d.zbritja ? `— discount: ${d.zbritja}` : ''}</span>
          <span>
            <button className="btn-edit" onClick={() => handleEdit(d)}>Edit</button>
            <button className="btn-delete" onClick={() => handleDelete(d.id)}>Delete</button>
          </span>
        </div>
      ))}
    </div>
  );
}

export default OrderDetails;