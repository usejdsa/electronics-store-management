import { useEffect, useState } from 'react';
import SearchIcon from '../assets/search-icon.svg';
import { useLang } from '../context/LangContext';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';
import Modal from './Modal';

const empty = { emri_kompanise: '', kontakti: '', email: '', telefoni: '', adresa: '' };
const inp = { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 };
const label = { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 };
const STATUS_COLOR = { draft:'#f1f5f9', ordered:'#dbeafe', received:'#dcfce7', cancelled:'#fee2e2' };
const STATUS_TEXT  = { draft:'#475569', ordered:'#1d4ed8', received:'#15803d', cancelled:'#dc2626' };

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [history, setHistory] = useState({});
  const { t } = useLang();
  const { can } = useRole();
  const canMutate = can('mutate:suppliers');

  const fetchSuppliers = () => api.get('/suppliers').then(r => setSuppliers(r.data)).catch(console.error);

  useEffect(() => { fetchSuppliers(); }, []);

  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const openAdd = () => { setEditId(null); setForm(empty); setModalOpen(true); };
  const openEdit = (s) => { setEditId(s.id); setForm({ emri_kompanise: s.emri_kompanise || '', kontakti: s.kontakti || '', email: s.email || '', telefoni: s.telefoni || '', adresa: s.adresa || '' }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditId(null); setForm(empty); };

  const handleSubmit = e => {
    e.preventDefault();
    const req = editId ? api.put(`/suppliers/${editId}`, form) : api.post('/suppliers', form);
    req.then(() => { closeModal(); fetchSuppliers(); }).catch(console.error);
  };

  const handleDelete = id => {
    if (!window.confirm(t.confirmDeleteSupplier)) return;
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{t.suppliersTitle}</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{suppliers.length} {t.suppliersCount}</p>
        </div>
        {canMutate && (
          <button onClick={openAdd} style={{ padding: '9px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            {t.addSupplier}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {suppliers.map(s => (
          <div key={s.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px' }}>
              <div style={{ width: 40, height: 40, background: '#e0e7ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🏭</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 15 }}>{s.emri_kompanise}</div>
                <div style={{ color: '#64748b', fontSize: 13 }}>
                  {[s.kontakti, s.email, s.telefoni].filter(Boolean).join(' · ')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => toggleHistory(s.id)} style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: expandedId === s.id ? '#eef2ff' : 'white', color: expandedId === s.id ? '#4f46e5' : '#64748b', fontSize: 12, cursor: 'pointer' }}>
                  {expandedId === s.id ? 'Fshih Porosite' : 'Shiko Porosite'}
                </button>
                {canMutate && (
                  <>
                    <button onClick={() => openEdit(s)} style={{ padding: '5px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, color: '#1d4ed8', fontSize: 12, cursor: 'pointer' }}>{t.edit}</button>
                    <button onClick={() => handleDelete(s.id)} style={{ padding: '5px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 12, cursor: 'pointer' }}>{t.delete}</button>
                  </>
                )}
              </div>
            </div>
            {expandedId === s.id && (
              <div style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9', padding: '12px 18px' }}>
                {!history[s.id] ? <div style={{ color: '#94a3b8', fontSize: 13 }}>Duke ngarkuar...</div>
                  : history[s.id].length === 0 ? <div style={{ color: '#94a3b8', fontSize: 13 }}>Nuk ka porosi furnizimi.</div>
                  : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead><tr style={{ color: '#94a3b8' }}>
                        {['#','Produkti','Sasia','Totali','Statusi','Data'].map(h => <th key={h} style={{ padding: '4px 8px', textAlign: 'left', fontWeight: 600 }}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {history[s.id].map(o => (
                          <tr key={o.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '6px 8px', color: '#94a3b8' }}>#{o.id}</td>
                            <td style={{ padding: '6px 8px' }}>{o.produkt_emri}</td>
                            <td style={{ padding: '6px 8px' }}>{o.sasia}</td>
                            <td style={{ padding: '6px 8px', fontWeight: 600 }}>{parseFloat(o.totali).toFixed(2)}€</td>
                            <td style={{ padding: '6px 8px' }}><span style={{ background: STATUS_COLOR[o.statusi] || '#f1f5f9', color: STATUS_TEXT[o.statusi] || '#475569', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{o.statusi}</span></td>
                            <td style={{ padding: '6px 8px', color: '#94a3b8' }}>{new Date(o.created_at).toLocaleDateString('sq-AL')}</td>
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

      <Modal isOpen={modalOpen} onClose={closeModal} title={editId ? t.editSupplier : t.newSupplier}>
        <form onSubmit={handleSubmit}>
          <div><label style={label}>Emri i Kompanisë *</label><input required style={inp} value={form.emri_kompanise} onChange={set('emri_kompanise')} placeholder="p.sh. TechSupply SH.P.K" /></div>
          <div><label style={label}>Kontakti</label><input style={inp} value={form.kontakti} onChange={set('kontakti')} placeholder="Besnik Krasniqi" /></div>
          <div><label style={label}>Email</label><input type="email" style={inp} value={form.email} onChange={set('email')} placeholder="info@supplier.com" /></div>
          <div><label style={label}>Telefoni</label><input style={inp} value={form.telefoni} onChange={set('telefoni')} placeholder="+383 44 000 000" /></div>
          <div><label style={label}>Adresa</label><input style={inp} value={form.adresa} onChange={set('adresa')} placeholder="Rruga Prishtina, Nr. 1" /></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{ flex: 1, padding: 11, background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              {editId ? t.saveChanges : t.addSupplier}
            </button>
            <button type="button" onClick={closeModal} style={{ padding: '11px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, color: '#64748b', fontSize: 14, cursor: 'pointer' }}>{t.cancel}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Suppliers;