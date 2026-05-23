import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';

const empty = { supplier_id: '', product_id: '', sasia: '', cmimi_blerjes: '', shenime: '' };
const STATUSES = ['draft', 'ordered', 'received', 'cancelled'];

function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const { can } = useRole();

  const canMutate = can('mutate:purchase-orders');

  const fetchData = () => Promise.all([
    api.get('/purchase-orders').then(r => setOrders(r.data)),
    api.get('/suppliers').then(r => setSuppliers(r.data)),
    api.get('/products').then(r => setProducts(r.data)),
  ]).catch(console.error);

  useEffect(() => { fetchData(); }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      supplier_id: Number(form.supplier_id),
      product_id: Number(form.product_id),
      sasia: Number(form.sasia),
      cmimi_blerjes: Number(form.cmimi_blerjes),
      shenime: form.shenime || null,
    };
    const req = editId ? api.put(`/purchase-orders/${editId}`, payload) : api.post('/purchase-orders', payload);
    req.then(() => { setEditId(null); setForm(empty); fetchData(); }).catch(console.error);
  };

  const handleEdit = (o) => {
    setEditId(o.id);
    setForm({
      supplier_id: o.supplier_id ? String(o.supplier_id) : '',
      product_id: o.product_id ? String(o.product_id) : '',
      sasia: o.sasia ?? '',
      cmimi_blerjes: o.cmimi_blerjes ?? '',
      shenime: o.shenime || '',
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this purchase order?')) return;
    api.delete(`/purchase-orders/${id}`).then(fetchData).catch(console.error);
  };

  const handleStatusChange = (id, statusi) => {
    api.put(`/purchase-orders/${id}/status`, { statusi }).then(fetchData).catch(console.error);
  };

  return (
    <div>
      <h2>Purchase Orders</h2>

      {canMutate && (
        <>
          {editId && (
            <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, padding: '8px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
              <span>Editing purchase order #{editId}</span>
              <button onClick={() => { setEditId(null); setForm(empty); }} style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', textDecoration: 'underline' }}>Cancel</button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <select required value={form.supplier_id} onChange={set('supplier_id')}>
              <option value="">Select Supplier *</option>
              {suppliers.map(s => <option key={s.id} value={String(s.id)}>{s.emri_kompanise}</option>)}
            </select>
            <select required value={form.product_id} onChange={set('product_id')}>
              <option value="">Select Product *</option>
              {products.map(p => <option key={p.id} value={String(p.id)}>{p.emri}</option>)}
            </select>
            <input required type="number" placeholder="Quantity *" value={form.sasia} onChange={set('sasia')} />
            <input required type="number" step="0.01" placeholder="Unit price *" value={form.cmimi_blerjes} onChange={set('cmimi_blerjes')} />
            <input placeholder="Notes" value={form.shenime} onChange={set('shenime')} />
            <button type="submit" className="btn-add">{editId ? 'Update Order' : 'Add Order'}</button>
          </form>
        </>
      )}

      {orders.map(o => (
        <div key={o.id} className="list-row">
          <span>
            {o.emri_kompanise} — {o.produkt_emri} — qty: {o.sasia} — {o.totali}€
            &nbsp;[<strong>{o.statusi}</strong>]
            {canMutate && (
              <>
                &nbsp;
                <select
                  value={o.statusi}
                  onChange={e => handleStatusChange(o.id, e.target.value)}
                  style={{ fontSize: 12, padding: '2px 4px', marginLeft: 4 }}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </>
            )}
          </span>
          {canMutate && (
            <span>
              {o.statusi !== 'received' && (
                <button className="btn-edit" onClick={() => handleEdit(o)}>Edit</button>
              )}
              <button className="btn-delete" onClick={() => handleDelete(o.id)}>Delete</button>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default PurchaseOrders;