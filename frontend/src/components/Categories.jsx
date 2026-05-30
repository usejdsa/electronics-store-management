import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';
import Modal from './Modal';

const empty = { emertimi: '', pershkrimi: '', kategoria_prind_id: '', ikona: '' };

const inp = { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 };
const label = { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 };

function Categories() {
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [modalOpen, setModalOpen] = useState(false);
  const { can } = useRole();
  const canMutate = can('mutate:categories');

  const fetchCategories = () => api.get('/categories').then(res => setCategories(Array.isArray(res.data) ? res.data : [])).catch(console.error);

  useEffect(() => { fetchCategories(); }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const openAdd = () => { setEditId(null); setForm(empty); setModalOpen(true); };
  const openEdit = (c) => {
    setEditId(c.id);
    setForm({ emertimi: c.emertimi || '', pershkrimi: c.pershkrimi || '', kategoria_prind_id: c.kategoria_prind_id || '', ikona: c.ikona || '' });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditId(null); setForm(empty); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { emertimi: form.emertimi, pershkrimi: form.pershkrimi || null, kategoria_prind_id: form.kategoria_prind_id || null, ikona: form.ikona || null };
    const req = editId ? api.put(`/categories/${editId}`, payload) : api.post('/categories', payload);
    req.then(() => { closeModal(); fetchCategories(); }).catch(console.error);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Fshi këtë kategori?')) return;
    api.delete(`/categories/${id}`).then(() => setCategories(prev => prev.filter(c => c.id !== id))).catch(console.error);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Kategoritë</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{categories.length} kategori gjithsej</p>
        </div>
        {canMutate && (
          <button onClick={openAdd} style={{ padding: '9px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            + Shto Kategori
          </button>
        )}
      </div>

      {/* Lista */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['ID', 'Ikona', 'Emri', 'Përshkrimi', 'Prind', 'Veprimet'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Nuk ka kategori</td></tr>
            ) : categories.map(c => (
              <tr key={c.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13 }}>#{c.id}</td>
                <td style={{ padding: '12px 16px', fontSize: 20 }}>{c.ikona || '📁'}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>{c.emertimi}</td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{c.pershkrimi || '—'}</td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{c.kategoria_prind_id ? `#${c.kategoria_prind_id}` : '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  {canMutate && (
                    <>
                      <button onClick={() => openEdit(c)} style={{ padding: '4px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, color: '#1d4ed8', fontSize: 12, cursor: 'pointer', marginRight: 6 }}>Ndrysho</button>
                      <button onClick={() => handleDelete(c.id)} style={{ padding: '4px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#dc2626', fontSize: 12, cursor: 'pointer' }}>Fshi</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editId ? 'Ndrysho Kategorinë' : 'Shto Kategori të Re'}>
        <form onSubmit={handleSubmit}>
          <div><label style={label}>Emri *</label><input required style={inp} value={form.emertimi} onChange={set('emertimi')} placeholder="p.sh. Telefona" /></div>
          <div><label style={label}>Përshkrimi</label><input style={inp} value={form.pershkrimi} onChange={set('pershkrimi')} placeholder="Përshkrim i shkurtër" /></div>
          <div><label style={label}>Ikona (emoji)</label><input style={inp} value={form.ikona} onChange={set('ikona')} placeholder="📱" /></div>
          <div>
            <label style={label}>Kategoria Prind</label>
            <select style={inp} value={form.kategoria_prind_id} onChange={set('kategoria_prind_id')}>
              <option value="">Pa prind (kryesore)</option>
              {categories.filter(c => c.id !== editId && !c.kategoria_prind_id).map(c => <option key={c.id} value={c.id}>{c.emertimi}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button type="submit" style={{ flex: 1, padding: 11, background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              {editId ? 'Ruaj Ndryshimet' : 'Shto Kategorinë'}
            </button>
            <button type="button" onClick={closeModal} style={{ padding: '11px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, color: '#64748b', fontSize: 14, cursor: 'pointer' }}>Anulo</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Categories;