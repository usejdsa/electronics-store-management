import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';

const empty = { supplier_id: '', product_id: '', sasia: '', cmimi_blerjes: '', shenime: '' };
const STEPS  = ['draft', 'ordered', 'received', 'cancelled'];

const STEP_STYLE = {
  draft:     { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
  ordered:   { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
  received:  { bg: '#dcfce7', color: '#15803d', border: '#86efac' },
  cancelled: { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
};

// Which steps can you move to from a given status
const ALLOWED_NEXT = {
  draft:     ['ordered', 'cancelled'],
  ordered:   ['received', 'cancelled'],
  received:  [],   // locked — stock already added
  cancelled: [],   // locked
};

function StatusStepper({ order, canMutate, onStatusChange }) {
  const mainSteps = ['draft', 'ordered', 'received'];
  const cur = order.statusi;
  const curIdx = mainSteps.indexOf(cur);
  const isCancelled = cur === 'cancelled';
  const isLocked = cur === 'received' || cur === 'cancelled';
  const allowed = ALLOWED_NEXT[cur] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Step track */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {mainSteps.map((s, i) => {
          const done    = !isCancelled && curIdx > i;
          const current = !isCancelled && curIdx === i;
          const future  = isCancelled ? false : curIdx < i;
          const dotBg   = done ? '#4f46e5' : current ? '#4f46e5' : '#e2e8f0';
          const dotColor = (done || current) ? 'white' : '#94a3b8';
          const lineColor = done ? '#4f46e5' : '#e2e8f0';

          return (
            <div key={s} style={{ display:'flex', alignItems:'center', flex: i < mainSteps.length-1 ? 1 : 'none' }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                <div style={{ width:26, height:26, borderRadius:'50%', background: isCancelled ? '#fca5a5' : dotBg, color: isCancelled ? '#dc2626' : dotColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, border: current ? '2px solid #6366f1' : 'none', boxSizing:'border-box' }}>
                  {done ? '✓' : i + 1}
                </div>
                <span style={{ fontSize:10, fontWeight: current ? 700 : 500, color: isCancelled ? '#dc2626' : current ? '#4f46e5' : done ? '#4f46e5' : '#94a3b8', textTransform:'uppercase', letterSpacing:'0.04em' }}>{s}</span>
              </div>
              {i < mainSteps.length - 1 && (
                <div style={{ flex:1, height:2, background: lineColor, margin:'0 4px', marginBottom:16 }} />
              )}
            </div>
          );
        })}
        {isCancelled && (
          <span style={{ marginLeft:12, fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:'#fee2e2', color:'#dc2626' }}>CANCELLED</span>
        )}
      </div>

      {/* Action buttons */}
      {canMutate && !isLocked && (
        <div style={{ display:'flex', gap:8, marginTop:4 }}>
          {allowed.filter(s => s !== 'cancelled').map(s => (
            <button key={s} onClick={() => onStatusChange(order.id, s)}
              style={{ padding:'5px 14px', borderRadius:8, border:'1px solid #6366f1', background:'#eef2ff', color:'#4f46e5', fontSize:12, fontWeight:700, cursor:'pointer' }}>
              Mark as {s} {s === 'received' ? '→ adds stock' : ''}
            </button>
          ))}
          {allowed.includes('cancelled') && (
            <button onClick={() => { if (window.confirm('Cancel this order?')) onStatusChange(order.id, 'cancelled'); }}
              style={{ padding:'5px 14px', borderRadius:8, border:'1px solid #fca5a5', background:'#fff5f5', color:'#dc2626', fontSize:12, fontWeight:600, cursor:'pointer' }}>
              Cancel
            </button>
          )}
        </div>
      )}
      {isLocked && (
        <span style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>
          {cur === 'received' ? 'Stock has been added. This order is locked.' : 'This order is cancelled.'}
        </span>
      )}
    </div>
  );
}

function PurchaseOrders() {
  const [orders, setOrders]       = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts]   = useState([]);
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState(empty);
  const { can } = useRole();
  const canMutate = can('mutate:purchase-orders');

  const liveTotal = form.sasia && form.cmimi_blerjes
    ? (Number(form.sasia) * Number(form.cmimi_blerjes)).toFixed(2)
    : null;

  const fetchData = () => Promise.all([
    api.get('/purchase-orders').then(r => setOrders(r.data)),
    api.get('/suppliers').then(r => setSuppliers(r.data)),
    api.get('/products').then(r => setProducts(r.data)),
  ]).catch(console.error);

  useEffect(() => { fetchData(); }, []);

  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {
      supplier_id:   Number(form.supplier_id),
      product_id:    Number(form.product_id),
      sasia:         Number(form.sasia),
      cmimi_blerjes: Number(form.cmimi_blerjes),
      shenime:       form.shenime || null,
    };
    const req = editId ? api.put(`/purchase-orders/${editId}`, payload) : api.post('/purchase-orders', payload);
    req.then(() => { setEditId(null); setForm(empty); fetchData(); }).catch(console.error);
  };

  const handleEdit = o => {
    setEditId(o.id);
    setForm({ supplier_id: String(o.supplier_id||''), product_id: String(o.product_id||''), sasia: o.sasia??'', cmimi_blerjes: o.cmimi_blerjes??'', shenime: o.shenime||'' });
  };

  const handleDelete = id => {
    if (!window.confirm('Delete this purchase order?')) return;
    api.delete(`/purchase-orders/${id}`).then(fetchData).catch(console.error);
  };

  const handleStatusChange = (id, statusi) => {
    api.put(`/purchase-orders/${id}/status`, { statusi }).then(fetchData).catch(console.error);
  };

  const canEdit = o => o.statusi === 'draft';

  return (
    <div>
      <h2>Purchase Orders</h2>

      {canMutate && (
        <>
          {editId && (
            <div style={{ background:'#fef3c7', border:'1px solid #f59e0b', borderRadius:8, padding:'8px 14px', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:13 }}>
              <span>Editing order #{editId} — only draft orders can be edited</span>
              <button onClick={() => { setEditId(null); setForm(empty); }} style={{ background:'none', border:'none', color:'#92400e', cursor:'pointer', textDecoration:'underline' }}>Cancel</button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <select required value={form.supplier_id} onChange={set('supplier_id')}>
              <option value="">Select Supplier *</option>
              {suppliers.map(s => <option key={s.id} value={String(s.id)}>{s.emri_kompanise}</option>)}
            </select>
            <select required value={form.product_id} onChange={set('product_id')}>
              <option value="">Select Product *</option>
              {products.map(p => <option key={p.id} value={String(p.id)}>{p.emri} (stock: {p.sasia_stokut})</option>)}
            </select>
            <input required type="number" min="1" placeholder="Quantity *" value={form.sasia} onChange={set('sasia')} />
            <input required type="number" step="0.01" placeholder="Unit price *" value={form.cmimi_blerjes} onChange={set('cmimi_blerjes')} />
            {liveTotal && (
              <div style={{ padding:'8px 12px', background:'#eef2ff', border:'1px solid #c7d2fe', borderRadius:8, fontSize:13, fontWeight:600, color:'#4f46e5' }}>
                Total: {liveTotal}€
              </div>
            )}
            <input placeholder="Notes" value={form.shenime} onChange={set('shenime')} />
            <button type="submit" className="btn-add">{editId ? 'Update Order' : 'Add Order'}</button>
          </form>
        </>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:8 }}>
        {orders.map(o => (
          <div key={o.id} style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:12, padding:'16px 18px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12, gap:8 }}>
              <div>
                <span style={{ fontWeight:700, color:'#0f172a' }}>#{o.id} — {o.emri_kompanise}</span>
                <span style={{ color:'#64748b', marginLeft:8 }}>{o.produkt_emri}</span>
                <span style={{ color:'#64748b', marginLeft:8 }}>· qty {o.sasia} · {parseFloat(o.totali).toFixed(2)}€</span>
                {o.shenime && <span style={{ color:'#94a3b8', marginLeft:8, fontSize:12 }}>({o.shenime})</span>}
              </div>
              <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                {canMutate && canEdit(o) && <button className="btn-edit" onClick={() => handleEdit(o)}>Edit</button>}
                {canMutate && <button className="btn-delete" onClick={() => handleDelete(o.id)}>Delete</button>}
              </div>
            </div>
            <StatusStepper order={o} canMutate={canMutate} onStatusChange={handleStatusChange} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PurchaseOrders;