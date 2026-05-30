import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';
import Modal from './Modal';

const empty = { supplier_id: '', product_id: '', sasia: '', cmimi_blerjes: '', shenime: '' };
const STEPS = ['draft', 'ordered', 'received', 'cancelled'];
const STEP_STYLE = { draft: { bg:'#f1f5f9',color:'#475569' }, ordered: { bg:'#dbeafe',color:'#1d4ed8' }, received: { bg:'#dcfce7',color:'#15803d' }, cancelled: { bg:'#fee2e2',color:'#dc2626' } };
const ALLOWED_NEXT = { draft: ['ordered','cancelled'], ordered: ['received','cancelled'], received: [], cancelled: [] };
const inp = { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 };
const label = { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 };

function StatusStepper({ order, canMutate, onStatusChange }) {
  const mainSteps = ['draft', 'ordered', 'received'];
  const cur = order.statusi;
  const curIdx = mainSteps.indexOf(cur);
  const isCancelled = cur === 'cancelled';
  const isLocked = cur === 'received' || cur === 'cancelled';
  const allowed = ALLOWED_NEXT[cur] || [];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        {mainSteps.map((s, i) => {
          const done = !isCancelled && curIdx > i;
          const current = !isCancelled && curIdx === i;
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < mainSteps.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: isCancelled ? '#fca5a5' : (done || current) ? '#4f46e5' : '#e2e8f0', color: isCancelled ? '#dc2626' : (done || current) ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, border: current ? '2px solid #6366f1' : 'none', boxSizing: 'border-box' }}>
                  {done ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 10, fontWeight: current ? 700 : 500, color: isCancelled ? '#dc2626' : current ? '#4f46e5' : done ? '#4f46e5' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s}</span>
              </div>
              {i < mainSteps.length - 1 && <div style={{ flex: 1, height: 2, background: done ? '#4f46e5' : '#e2e8f0', margin: '0 4px', marginBottom: 16 }} />}
            </div>
          );
        })}
        {isCancelled && <span style={{ marginLeft: 12, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#fee2e2', color: '#dc2626' }}>ANULUAR</span>}
      </div>
      {canMutate && !isLocked && (
        <div style={{ display: 'flex', gap: 8 }}>
          {allowed.filter(s => s !== 'cancelled').map(s => (
            <button key={s} onClick={() => onStatusChange(order.id, s)} style={{ padding: '5px 14px', borderRadius: 8, border: '1px solid #6366f1', background: '#eef2ff', color: '#4f46e5', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              Shëno si {s} {s === 'received' ? '→ shton stok' : ''}
            </button>
          ))}
          {allowed.includes('cancelled') && (
            <button onClick={() => { if (window.confirm('Anulo këtë porosi?')) onStatusChange(order.id, 'cancelled'); }} style={{ padding: '5px 14px', borderRadius: 8, border: '1px solid #fca5a5', background: '#fff5f5', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Anulo</button>
          )}
        </div>
      )}
    </div>
  );
}

function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [modalOpen, setModalOpen] = useState(false);
  const { can } = useRole();
  const canMutate = can('mutate:purchase-orders');

  const fetchData = () => Promise.all([
    api.get('/purchase-orders').then(r => setOrders(r.data)),
    api.get('/suppliers').then(r => setSuppliers(r.data)),
    api.get('/products').then(r => setProducts(r.data)),
  ]).catch(console.error);

  useEffect(() => { fetchData(); }, []);

  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const openAdd = () => { setEditId(null); setForm(empty); setModalOpen(true); };
  const openEdit = (o) => { setEditId(o.id); setForm({ supplier_id: String(o.supplier_id || ''), product_id: String(o.product_id || ''), sasia: o.sasia ?? '', cmimi_blerjes: o.cmimi_blerjes ?? '', shenime: o.shenime || '' }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditId(null); setForm(empty); };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = { supplier_id: Number(form.supplier_id), product_id: Number(form.product_id), sasia: Number(form.sasia), cmimi_blerjes: Number(form.cmimi_blerjes), shenime: form.shenime || null };
    const req = editId ? api.put(`/purchase-orders/${editId}`, payload) : api.post('/purchase-orders', payload);
    req.then(() => { closeModal(); fetchData(); }).catch(console.error);
  };

  const handleDelete = id => {
    if (!window.confirm('Fshi këtë porosi furnizimi?')) return;
    api.delete(`/purchase-orders/${id}`).then(fetchData).catch(console.error);
  };

  const handleStatusChange = (id, statusi) => {
    api.put(`/purchase-orders/${id}/status`, { statusi }).then(fetchData).catch(console.error);
  };

  const liveTotal = form.sasia && form.cmimi_blerjes ? (Number(form.sasia) * Number(form.cmimi_blerjes)).toFixed(2) : null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Porosite e Furnizimit</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{orders.length} porosi gjithsej</p>
        </div>
        {canMutate && (
          <button onClick={openAdd} style={{ padding: '9px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            + Shto Porosi
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map(o => {
          const st = STEP_STYLE[o.statusi] || STEP_STYLE.draft;
          return (
            <div key={o.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>#{o.id} — {o.emri_kompanise}</span>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: st.bg, color: st.color }}>{o.statusi}</span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: 13 }}>
                    {o.produkt_emri} · {o.sasia} copë · <strong>{parseFloat(o.totali).toFixed(2)}€</strong>
                    {o.shenime && <span style={{ color: '#94a3b8', marginLeft: 8 }}>({o.shenime})</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {canMutate && o.statusi === 'draft' && <button onClick={() => openEdit(o)} style={{ padding: '5px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, color: '#1d4ed8', fontSize: 12, cursor: 'pointer' }}>Ndrysho</button>}
                  {canMutate && <button onClick={() => handleDelete(o.id)} style={{ padding: '5px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 12, cursor: 'pointer' }}>Fshi</button>}
                </div>
              </div>
              <StatusStepper order={o} canMutate={canMutate} onStatusChange={handleStatusChange} />
            </div>
          );
        })}
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editId ? 'Ndrysho Porosinë' : 'Shto Porosi Furnizimi'}>
        <form onSubmit={handleSubmit}>
          <div>
            <label style={label}>Furnitori *</label>
            <select required style={inp} value={form.supplier_id} onChange={set('supplier_id')}>
              <option value="">Zgjidh Furnitorin</option>
              {suppliers.map(s => <option key={s.id} value={String(s.id)}>{s.emri_kompanise}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Produkti *</label>
            <select required style={inp} value={form.product_id} onChange={set('product_id')}>
              <option value="">Zgjidh Produktin</option>
              {products.map(p => <option key={p.id} value={String(p.id)}>{p.emri} (stok: {p.sasia_stokut})</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={label}>Sasia *</label><input required type="number" min="1" style={inp} value={form.sasia} onChange={set('sasia')} placeholder="10" /></div>
            <div><label style={label}>Çmimi/njësi (€) *</label><input required type="number" step="0.01" style={inp} value={form.cmimi_blerjes} onChange={set('cmimi_blerjes')} placeholder="50.00" /></div>
          </div>
          {liveTotal && (
            <div style={{ padding: '10px 14px', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 8, fontSize: 14, fontWeight: 700, color: '#4f46e5', marginBottom: 12 }}>
              Totali: {liveTotal}€
            </div>
          )}
          <div><label style={label}>Shënime</label><textarea style={{ ...inp, minHeight: 60, resize: 'vertical' }} value={form.shenime} onChange={set('shenime')} placeholder="Shënime shtesë..." /></div>
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

export default PurchaseOrders;