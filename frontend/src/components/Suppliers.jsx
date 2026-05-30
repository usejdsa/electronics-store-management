import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';

const empty = { emri_kompanise: '', kontakti: '', email: '', telefoni: '', adresa: '' };

function Suppliers() {
  const [suppliers, setSuppliers]   = useState([]);
  const [editId, setEditId]         = useState(null);
  const [form, setForm]             = useState(empty);
  const [expandedId, setExpandedId] = useState(null); // supplier whose PO history is shown
  const [history, setHistory]       = useState({});   // { [supplierId]: [...orders] }
  const { can } = useRole();
  const canMutate = can('mutate:suppliers');

  const fetchSuppliers = () =>
    api.get('/suppliers').then(r => setSuppliers(r.data)).catch(console.error);

  useEffect(() => { fetchSuppliers(); }, []);

  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    const req = editId ? api.put(`/suppliers/${editId}`, form) : api.post('/suppliers', form);
    req.then(() => { setEditId(null); setForm(empty); fetchSuppliers(); }).catch(console.error);
  };

  const handleEdit = s => {
    setEditId(s.id);
    setForm({ emri_kompanise: s.emri_kompanise||'', kontakti: s.kontakti||'', email: s.email||'', telefoni: s.telefoni||'', adresa: s.adresa||'' });
  };

  const handleDelete = id => {
    if (!window.confirm('Delete this supplier?')) return;
    api.delete(`/suppliers/${id}`).then(fetchSuppliers).catch(console.error);
  };

  const toggleHistory = async id => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (!history[id]) {
      const r = await api.get(`/purchase-orders?supplier_id=${id}`).catch(() => ({ data: [] }));
      setHistory(h => ({ ...h, [id]: r.data }));
    }
  };

  const STATUS_COLOR = { draft:'#f1f5f9', ordered:'#dbeafe', received:'#dcfce7', cancelled:'#fee2e2' };
  const STATUS_TEXT  = { draft:'#475569', ordered:'#1d4ed8', received:'#15803d', cancelled:'#dc2626' };

  return (
    <div>
      <h2>Suppliers</h2>

      {canMutate && (
        <>
          {editId && (
            <div style={{ background:'#fef3c7', border:'1px solid #f59e0b', borderRadius:8, padding:'8px 14px', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:13 }}>
              <span>Editing supplier #{editId}</span>
              <button onClick={() => { setEditId(null); setForm(empty); }} style={{ background:'none', border:'none', color:'#92400e', cursor:'pointer', textDecoration:'underline' }}>Cancel</button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <input required placeholder="Company name *" value={form.emri_kompanise} onChange={set('emri_kompanise')} />
            <input placeholder="Contact person"          value={form.kontakti}       onChange={set('kontakti')} />
            <input type="email" placeholder="Email"      value={form.email}          onChange={set('email')} />
            <input placeholder="Phone"                   value={form.telefoni}       onChange={set('telefoni')} />
            <input placeholder="Address"                 value={form.adresa}         onChange={set('adresa')} />
            <button type="submit" className="btn-add">{editId ? 'Update Supplier' : 'Add Supplier'}</button>
          </form>
        </>
      )}

      {suppliers.map(s => (
        <div key={s.id}>
          <div className="list-row" style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ flex:1 }}>
              <span style={{ fontWeight:600 }}>{s.emri_kompanise}</span>
              {s.kontakti && <span style={{ color:'#64748b', marginLeft:8 }}>· {s.kontakti}</span>}
              {s.email    && <span style={{ color:'#64748b', marginLeft:8 }}>· {s.email}</span>}
              {s.telefoni && <span style={{ color:'#64748b', marginLeft:8 }}>· {s.telefoni}</span>}
            </div>
            <button
              onClick={() => toggleHistory(s.id)}
              style={{ fontSize:12, padding:'4px 10px', borderRadius:8, border:'1px solid #e2e8f0', background: expandedId===s.id ? '#eef2ff':'white', color: expandedId===s.id ? '#4f46e5':'#64748b', cursor:'pointer' }}
            >
              {expandedId === s.id ? 'Hide orders' : 'View orders'}
            </button>
            {canMutate && (
              <span>
                <button className="btn-edit"   onClick={() => handleEdit(s)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(s.id)}>Delete</button>
              </span>
            )}
          </div>

          {/* Purchase history inline */}
          {expandedId === s.id && (
            <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:8, margin:'0 0 8px 0', padding:'12px 16px' }}>
              {!history[s.id] ? (
                <span style={{ fontSize:13, color:'#94a3b8' }}>Loading...</span>
              ) : history[s.id].length === 0 ? (
                <span style={{ fontSize:13, color:'#94a3b8' }}>No purchase orders yet.</span>
              ) : (
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead>
                    <tr style={{ color:'#94a3b8', textAlign:'left' }}>
                      <th style={{ padding:'4px 8px', fontWeight:600 }}>#</th>
                      <th style={{ padding:'4px 8px', fontWeight:600 }}>Product</th>
                      <th style={{ padding:'4px 8px', fontWeight:600 }}>Qty</th>
                      <th style={{ padding:'4px 8px', fontWeight:600 }}>Total</th>
                      <th style={{ padding:'4px 8px', fontWeight:600 }}>Status</th>
                      <th style={{ padding:'4px 8px', fontWeight:600 }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history[s.id].map(o => (
                      <tr key={o.id} style={{ borderTop:'1px solid #e2e8f0' }}>
                        <td style={{ padding:'6px 8px', color:'#94a3b8' }}>#{o.id}</td>
                        <td style={{ padding:'6px 8px' }}>{o.produkt_emri}</td>
                        <td style={{ padding:'6px 8px' }}>{o.sasia}</td>
                        <td style={{ padding:'6px 8px', fontWeight:600 }}>{parseFloat(o.totali).toFixed(2)}€</td>
                        <td style={{ padding:'6px 8px' }}>
                          <span style={{ background: STATUS_COLOR[o.statusi]||'#f1f5f9', color: STATUS_TEXT[o.statusi]||'#475569', borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700 }}>{o.statusi}</span>
                        </td>
                        <td style={{ padding:'6px 8px', color:'#94a3b8' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Suppliers;