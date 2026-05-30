import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';
import Modal from './Modal';

const empty = { order_id: '', product_id: '', sasia: '', cmimi_unit: '', zbritja: '' };
const inp = { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 };
const label = { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 };

function OrderDetails() {
  const [details, setDetails] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [modalOpen, setModalOpen] = useState(false);
  const { can } = useRole();
  const canMutate = can('mutate:order-details');
  const canDelete = can('delete:order-details');

  const fetchDetails = () => api.get('/order-details').then(res => setDetails(res.data)).catch(console.error);

  useEffect(() => {
    fetchDetails();
    api.get('/orders').then(res => setOrders(res.data)).catch(console.error);
    api.get('/products').then(res => setProducts(res.data)).catch(console.error);
  }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const openAdd = () => { setEditId(null); setForm(empty); setModalOpen(true); };
  const openEdit = (d) => {
    setEditId(d.id);
    setForm({ order_id: d.order_id ? String(d.order_id) : '', product_id: d.product_id ? String(d.product_id) : '', sasia: d.sasia ?? '', cmimi_unit: d.cmimi_unit ?? '', zbritja: d.zbritja ?? '' });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditId(null); setForm(empty); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { order_id: Number(form.order_id), product_id: Number(form.product_id), sasia: Number(form.sasia), cmimi_unit: Number(form.cmimi_unit), zbritja: form.zbritja ? Number(form.zbritja) : 0 };
    const req = editId ? api.put(`/order-details/${editId}`, payload) : api.post('/order-details', payload);
    req.then(() => { closeModal(); fetchDetails(); }).catch(console.error);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Fshi këtë detaj?')) return;
    api.delete(`/order-details/${id}`).then(fetchDetails).catch(console.error);
  };

  const liveTotal = form.sasia && form.cmimi_unit
    ? ((Number(form.sasia) * Number(form.cmimi_unit)) - Number(form.zbritja || 0)).toFixed(2)
    : null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Detajet e Porosive</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{details.length} detaje gjithsej</p>
        </div>
        {canMutate && (
          <button onClick={openAdd} style={{ padding: '9px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            + Shto Detaj
          </button>
        )}
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['ID', 'Porosia', 'Produkti', 'Sasia', 'Çmimi/njësi', 'Zbritja', 'Totali', 'Veprimet'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {details.length === 0 ? (
              <tr><td colSpan="8" style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Nuk ka detaje</td></tr>
            ) : details.map(d => {
              const total = ((Number(d.sasia) * Number(d.cmimi_unit)) - Number(d.zbritja || 0)).toFixed(2);
              return (
                <tr key={d.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13 }}>#{d.id}</td>
                  <td style={{ padding: '12px 16px', color: '#4f46e5', fontSize: 13, fontWeight: 600 }}>#{d.order_id}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0f172a' }}>{d.produkt_emri || `#${d.product_id}`}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{d.sasia}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{d.cmimi_unit}€</td>
                  <td style={{ padding: '12px 16px', color: d.zbritja ? '#ef4444' : '#94a3b8' }}>{d.zbritja ? `-${d.zbritja}€` : '—'}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>{total}€</td>
                  <td style={{ padding: '12px 16px' }}>
                    {canMutate && <button onClick={() => openEdit(d)} style={{ padding: '4px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, color: '#1d4ed8', fontSize: 12, cursor: 'pointer', marginRight: 6 }}>Ndrysho</button>}
                    {canDelete && <button onClick={() => handleDelete(d.id)} style={{ padding: '4px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#dc2626', fontSize: 12, cursor: 'pointer' }}>Fshi</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editId ? 'Ndrysho Detajin' : 'Shto Detaj të Ri'}>
        <form onSubmit={handleSubmit}>
          <div>
            <label style={label}>Porosia *</label>
            <select required style={inp} value={form.order_id} onChange={set('order_id')}>
              <option value="">Zgjidh Porosinë</option>
              {orders.map(o => <option key={o.id} value={String(o.id)}>Porosia #{o.id} — {o.customer_emri}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Produkti *</label>
            <select required style={inp} value={form.product_id} onChange={set('product_id')}>
              <option value="">Zgjidh Produktin</option>
              {products.map(p => <option key={p.id} value={String(p.id)}>{p.emri}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={label}>Sasia *</label><input required type="number" min="1" style={inp} value={form.sasia} onChange={set('sasia')} placeholder="1" /></div>
            <div><label style={label}>Çmimi/njësi (€) *</label><input required type="number" step="0.01" style={inp} value={form.cmimi_unit} onChange={set('cmimi_unit')} placeholder="99.99" /></div>
            <div><label style={label}>Zbritja (€)</label><input type="number" step="0.01" style={inp} value={form.zbritja} onChange={set('zbritja')} placeholder="0.00" /></div>
            {liveTotal && (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ padding: '9px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 14, fontWeight: 700, color: '#15803d' }}>
                  Totali: {liveTotal}€
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{ flex: 1, padding: 11, background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              {editId ? 'Ruaj Ndryshimet' : 'Shto Detajin'}
            </button>
            <button type="button" onClick={closeModal} style={{ padding: '11px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, color: '#64748b', fontSize: 14, cursor: 'pointer' }}>Anulo</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default OrderDetails;