import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';
import Modal from './Modal';

const empty = { emri: '', kategoria_id: '', marka: '', modeli: '', pershkrimi: '', cmimi: '', cmimi_zbritjes: '', sasia_stokut: '', garancia_muaj: '' };
const inp = { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 };
const label = { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 };

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef();
  const { can } = useRole();
  const canMutate = can('mutate:products');

  const fetchProducts = () => api.get('/products').then(res => setProducts(res.data)).catch(console.error);

  useEffect(() => {
    fetchProducts();
    api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const openAdd = () => { setEditId(null); setForm(empty); setImageFile(null); setImagePreview(null); setModalOpen(true); };
  const openEdit = (p) => {
    setEditId(p.id);
    setForm({ emri: p.emri || '', kategoria_id: p.kategoria_id != null ? String(p.kategoria_id) : '', marka: p.marka || '', modeli: p.modeli || '', pershkrimi: p.pershkrimi || '', cmimi: p.cmimi ?? '', cmimi_zbritjes: p.cmimi_zbritjes ?? '', sasia_stokut: p.sasia_stokut ?? '', garancia_muaj: p.garancia_muaj ?? '' });
    setImageFile(null);
    setImagePreview(p.foto_kryesore || null);
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditId(null); setForm(empty); setImageFile(null); setImagePreview(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v || ''));
    if (imageFile) data.append('foto', imageFile);
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const req = editId ? api.put(`/products/${editId}`, data, config) : api.post('/products', data, config);
    req.then(() => { closeModal(); fetchProducts(); }).catch(console.error);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Fshi këtë produkt?')) return;
    api.delete(`/products/${id}`).then(() => setProducts(prev => prev.filter(p => p.id !== id))).catch(console.error);
  };

  const filtered = products.filter(p =>
    `${p.emri} ${p.marka} ${p.modeli}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Produktet</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{products.length} produkte gjithsej</p>
        </div>
        {canMutate && (
          <button onClick={openAdd} style={{ padding: '9px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            + Shto Produkt
          </button>
        )}
      </div>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🔍</span>
        <input placeholder="Kërko produkt..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['', 'Emri', 'Kategoria', 'Çmimi', 'Stoku', 'Garancia', 'Veprimet'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Nuk ka produkte</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: '#f0f4ff', border: '1px solid #e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.foto_kryesore
                      ? <img src={p.foto_kryesore} alt={p.emri} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; }} />
                      : <span style={{ fontSize: 20 }}>📦</span>
                    }
                  </div>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{p.emri}</div>
                  <div style={{ color: '#94a3b8', fontSize: 12 }}>{p.marka} {p.modeli}</div>
                </td>
                <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 13 }}>{p.kategoria_emri || '—'}</td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.cmimi}€</div>
                  {p.cmimi_zbritjes && <div style={{ fontSize: 11, color: '#ef4444' }}>{p.cmimi_zbritjes}€ zbritje</div>}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: p.sasia_stokut > 5 ? '#dcfce7' : '#fef9c3', color: p.sasia_stokut > 5 ? '#15803d' : '#a16207' }}>
                    {p.sasia_stokut} copë
                  </span>
                </td>
                <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 13 }}>{p.garancia_muaj ? `${p.garancia_muaj} muaj` : '—'}</td>
                <td style={{ padding: '10px 16px' }}>
                  {canMutate && (
                    <>
                      <button onClick={() => openEdit(p)} style={{ padding: '4px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, color: '#1d4ed8', fontSize: 12, cursor: 'pointer', marginRight: 6 }}>Ndrysho</button>
                      <button onClick={() => handleDelete(p.id)} style={{ padding: '4px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#dc2626', fontSize: 12, cursor: 'pointer' }}>Fshi</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editId ? 'Ndrysho Produktin' : 'Shto Produkt të Ri'} size="lg">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: '1/-1' }}><label style={label}>Emri *</label><input required style={inp} value={form.emri} onChange={set('emri')} placeholder="p.sh. iPhone 15 Pro" /></div>
            <div>
              <label style={label}>Kategoria</label>
              <select style={inp} value={form.kategoria_id} onChange={set('kategoria_id')}>
                <option value="">Pa kategori</option>
                {categories.map(c => <option key={c.id} value={String(c.id)}>{c.emertimi}</option>)}
              </select>
            </div>
            <div><label style={label}>Marka</label><input style={inp} value={form.marka} onChange={set('marka')} placeholder="Apple" /></div>
            <div><label style={label}>Modeli</label><input style={inp} value={form.modeli} onChange={set('modeli')} placeholder="iPhone 15 Pro" /></div>
            <div><label style={label}>Çmimi (€) *</label><input required type="number" step="0.01" style={inp} value={form.cmimi} onChange={set('cmimi')} placeholder="999.00" /></div>
            <div><label style={label}>Çmimi me Zbritje (€)</label><input type="number" step="0.01" style={inp} value={form.cmimi_zbritjes} onChange={set('cmimi_zbritjes')} placeholder="899.00" /></div>
            <div><label style={label}>Sasia në Stok</label><input type="number" style={inp} value={form.sasia_stokut} onChange={set('sasia_stokut')} placeholder="10" /></div>
            <div><label style={label}>Garancia (muaj)</label><input type="number" style={inp} value={form.garancia_muaj} onChange={set('garancia_muaj')} placeholder="24" /></div>
            <div style={{ gridColumn: '1/-1' }}><label style={label}>Përshkrimi</label><textarea style={{ ...inp, minHeight: 72, resize: 'vertical' }} value={form.pershkrimi} onChange={set('pershkrimi')} placeholder="Përshkrim i produktit..." /></div>
          </div>

          {/* Foto upload */}
          <div style={{ marginBottom: 16 }}>
            <label style={label}>Foto e Produktit</label>
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleImageFile(e.dataTransfer.files[0]); }}
              style={{ border: `2px dashed ${dragging ? '#6366f1' : '#e2e8f0'}`, borderRadius: 10, padding: imagePreview ? 0 : 24, textAlign: 'center', cursor: 'pointer', background: dragging ? '#eef2ff' : '#fafafa', position: 'relative', overflow: 'hidden', minHeight: imagePreview ? 120 : 'auto', transition: 'all 0.15s' }}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: 160, objectFit: 'contain', display: 'block' }} />
                  <button type="button" onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer', fontSize: 13 }}>✕</button>
                </>
              ) : (
                <div style={{ color: '#94a3b8', fontSize: 14 }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
                  Kliko ose zvarrit foto këtu
                </div>
              )}
              <input ref={inputRef} type="file" accept="image/*" onChange={(e) => handleImageFile(e.target.files[0])} style={{ display: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{ flex: 1, padding: 11, background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              {editId ? 'Ruaj Ndryshimet' : 'Shto Produktin'}
            </button>
            <button type="button" onClick={closeModal} style={{ padding: '11px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, color: '#64748b', fontSize: 14, cursor: 'pointer' }}>Anulo</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Products;