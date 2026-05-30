import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';

const empty = { product_id: '', sasia: '', shenime: '' };

const TYPE_STYLE = {
  hyrje:     { bg: '#dcfce7', color: '#15803d', label: 'Stock In' },
  dalje:     { bg: '#fee2e2', color: '#dc2626', label: 'Stock Out' },
  rregullim: { bg: '#e0e7ff', color: '#4338ca', label: 'Adjustment' },
};

const SOURCE_STYLE = {
  PurchaseOrder: { bg: '#dbeafe', color: '#1d4ed8' },
  Order:         { bg: '#fef9c3', color: '#a16207' },
  Manual:        { bg: '#f1f5f9', color: '#475569' },
};

function Inventory() {
  const [items, setItems]     = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm]       = useState(empty);
  const [filterType, setFilterType] = useState('');
  const { can } = useRole();
  const canMutate = can('mutate:inventory');

  const fetchData = () => {
    api.get('/inventory').then(r => setItems(r.data)).catch(console.error);
    api.get('/products').then(r => setProducts(r.data)).catch(console.error);
  };

  useEffect(() => { fetchData(); }, []);

  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    api.post('/inventory', {
      product_id: Number(form.product_id),
      lloji: 'rregullim',
      sasia: Number(form.sasia),
      shenime: form.shenime || null,
    }).then(() => { setForm(empty); fetchData(); }).catch(console.error);
  };

  const filtered = filterType ? items.filter(i => i.lloji === filterType) : items;

  return (
    <div>
      <h2>Inventory Log</h2>

      <div style={{ background:'#fef9c3', border:'1px solid #fde68a', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#92400e' }}>
        Stock movements are created automatically when a Purchase Order is marked <strong>received</strong> (stock in) or a customer order is fulfilled (stock out). Use the form below only to correct a discrepancy found during a physical count.
      </div>

      {canMutate && (
        <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:10, padding:'16px', marginBottom:16 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#374151', marginBottom:10 }}>Manual Stock Correction</div>
          <form onSubmit={handleSubmit} style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'flex-end' }}>
            <select required value={form.product_id} onChange={set('product_id')} style={{ flex:'1 1 200px' }}>
              <option value="">Select Product *</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.emri} (stock: {p.sasia_stokut})</option>)}
            </select>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              <label style={{ fontSize:11, color:'#64748b', fontWeight:600 }}>Qty change (+ or −)</label>
              <input required type="number" placeholder="e.g. -3 or +5" value={form.sasia} onChange={set('sasia')} style={{ width:120 }} />
            </div>
            <input placeholder="Reason (required for audit)" value={form.shenime} onChange={set('shenime')} style={{ flex:'1 1 200px' }} />
            <button type="submit" className="btn-add" style={{ alignSelf:'flex-end' }}>Apply Correction</button>
          </form>
        </div>
      )}

      {/* Filter */}
      <div style={{ display:'flex', gap:8, marginBottom:12, alignItems:'center' }}>
        <span style={{ fontSize:13, color:'#64748b' }}>Filter:</span>
        {['', 'hyrje', 'dalje', 'rregullim'].map(t => (
          <button key={t} onClick={() => setFilterType(t)} style={{ padding:'4px 12px', borderRadius:8, border:'1px solid', fontSize:12, cursor:'pointer', fontWeight: filterType===t ? 700 : 400, background: filterType===t ? '#4f46e5' : 'white', color: filterType===t ? 'white' : '#64748b', borderColor: filterType===t ? '#4f46e5' : '#e2e8f0' }}>
            {t === '' ? 'All' : TYPE_STYLE[t].label}
          </button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:12, color:'#94a3b8' }}>{filtered.length} entries</span>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {filtered.map(i => {
          const type   = TYPE_STYLE[i.lloji]   || { bg:'#f1f5f9', color:'#475569', label: i.lloji };
          const source = SOURCE_STYLE[i.referenca_lloji] || SOURCE_STYLE.Manual;
          const sign   = i.lloji === 'hyrje' ? '+' : i.lloji === 'dalje' ? '−' : '±';
          const date   = new Date(i.created_at);
          return (
            <div key={i.id} className="list-row" style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ background: type.bg, color: type.color, borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700, flexShrink:0 }}>{type.label}</span>
              <span style={{ fontWeight:600, color:'#0f172a', flex:1 }}>{i.produkt_emri}</span>
              <span style={{ fontWeight:700, color: i.lloji==='hyrje' ? '#15803d' : i.lloji==='dalje' ? '#dc2626' : '#4338ca', minWidth:40 }}>{sign}{Math.abs(i.sasia)}</span>
              <span style={{ background: source.bg, color: source.color, borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600, flexShrink:0 }}>{i.referenca_lloji || 'Manual'}</span>
              {i.shenime && <span style={{ fontSize:12, color:'#64748b' }}>{i.shenime}</span>}
              {i.user_emri && <span style={{ fontSize:12, color:'#94a3b8' }}>by {i.user_emri}</span>}
              <span style={{ fontSize:11, color:'#94a3b8', flexShrink:0 }}>{date.toLocaleDateString()} {date.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</span>
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ color:'#94a3b8', fontSize:13, padding:'20px 0' }}>No entries yet.</div>}
      </div>
    </div>
  );
}

export default Inventory;