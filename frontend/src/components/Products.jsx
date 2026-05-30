import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';

const empty = { emri: '', kategoria_id: '', marka: '', modeli: '', pershkrimi: '', cmimi: '', cmimi_zbritjes: '', sasia_stokut: '', garancia_muaj: '' };

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragging, setDragging] = useState(false);
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

  const clearImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('emri', form.emri);
    data.append('kategoria_id', form.kategoria_id || '');
    data.append('marka', form.marka || '');
    data.append('modeli', form.modeli || '');
    data.append('pershkrimi', form.pershkrimi || '');
    data.append('cmimi', form.cmimi);
    data.append('cmimi_zbritjes', form.cmimi_zbritjes || '');
    data.append('sasia_stokut', form.sasia_stokut || '0');
    data.append('garancia_muaj', form.garancia_muaj || '0');
    if (imageFile) data.append('foto', imageFile);

    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const req = editId ? api.put(`/products/${editId}`, data, config) : api.post('/products', data, config);
    req.then(() => { setEditId(null); setForm(empty); setImageFile(null); setImagePreview(null); fetchProducts(); }).catch(console.error);
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({
      emri: p.emri || '',
      kategoria_id: p.kategoria_id != null ? String(p.kategoria_id) : '',
      marka: p.marka || '',
      modeli: p.modeli || '',
      pershkrimi: p.pershkrimi || '',
      cmimi: p.cmimi ?? '',
      cmimi_zbritjes: p.cmimi_zbritjes ?? '',
      sasia_stokut: p.sasia_stokut ?? '',
      garancia_muaj: p.garancia_muaj ?? '',
    });
    setImageFile(null);
    setImagePreview(p.foto_kryesore || null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this product?')) return;
    api.delete(`/products/${id}`).then(() => setProducts(prev => prev.filter(p => p.id !== id))).catch(console.error);
  };

  return (
    <div>
      <h2>Products</h2>

      {canMutate && (
        <>
          {editId && (
            <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, padding: '8px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
              <span>Editing product #{editId}</span>
              <button onClick={() => { setEditId(null); setForm(empty); setImageFile(null); setImagePreview(null); }} style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', textDecoration: 'underline' }}>Cancel</button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input required placeholder="Product name *" value={form.emri} onChange={set('emri')} />
            <select value={form.kategoria_id} onChange={set('kategoria_id')}>
              <option value="">No category</option>
              {categories.map(c => <option key={c.id} value={String(c.id)}>{c.emertimi}</option>)}
            </select>
            <input placeholder="Brand" value={form.marka} onChange={set('marka')} />
            <input placeholder="Model" value={form.modeli} onChange={set('modeli')} />
            <input placeholder="Description" value={form.pershkrimi} onChange={set('pershkrimi')} />
            <input required type="number" step="0.01" placeholder="Price *" value={form.cmimi} onChange={set('cmimi')} />
            <input type="number" step="0.01" placeholder="Sale price" value={form.cmimi_zbritjes} onChange={set('cmimi_zbritjes')} />
            <input type="number" placeholder="Stock qty" value={form.sasia_stokut} onChange={set('sasia_stokut')} />
            <input type="number" placeholder="Warranty (months)" value={form.garancia_muaj} onChange={set('garancia_muaj')} />

            {/* Image upload */}
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleImageFile(e.dataTransfer.files[0]); }}
              style={{ border: `2px dashed ${dragging ? '#6366f1' : '#d1d5db'}`, borderRadius: 8, padding: imagePreview ? 0 : '16px', textAlign: 'center', cursor: 'pointer', background: dragging ? '#eef2ff' : '#fafafa', position: 'relative', overflow: 'hidden', minHeight: imagePreview ? 120 : 'auto' }}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: 140, objectFit: 'contain', display: 'block' }} />
                  <button type="button" onClick={clearImage} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: 13 }}>✕</button>
                  <div style={{ fontSize: 11, color: '#6b7280', padding: '4px 0', background: 'rgba(255,255,255,0.85)' }}>Click or drop to change</div>
                </>
              ) : (
                <div style={{ fontSize: 13, color: '#6b7280' }}>Click or drop to upload product photo</div>
              )}
              <input ref={inputRef} type="file" accept="image/*" onChange={(e) => handleImageFile(e.target.files[0])} style={{ display: 'none' }} />
            </div>

            <button type="submit" className="btn-add">{editId ? 'Update Product' : 'Add Product'}</button>
          </form>
        </>
      )}

      {products.map(p => (
        <div key={p.id} className="list-row" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 6, overflow: 'hidden', background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {p.foto_kryesore
              ? <img src={p.foto_kryesore} alt={p.emri} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
              : null}
            <div style={{ width: '100%', height: '100%', display: p.foto_kryesore ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#94a3b8', textAlign: 'center', padding: 2 }}>No photo</div>
          </div>
          <span style={{ flex: 1 }}>{p.emri} — {p.cmimi}€ {p.kategoria_emri ? `· ${p.kategoria_emri}` : ''} · stock: {p.sasia_stokut}</span>
          {canMutate && (
            <span>
              <button className="btn-edit" onClick={() => handleEdit(p)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default Products;