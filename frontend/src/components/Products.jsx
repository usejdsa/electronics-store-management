import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';

const empty = { emri: '', kategoria_id: '', marka: '', modeli: '', pershkrimi: '', cmimi: '', cmimi_zbritjes: '', sasia_stokut: '', garancia_muaj: '' };

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const { can } = useRole();

  const canMutate = can('mutate:products');

  const fetchProducts = () => api.get('/products').then(res => setProducts(res.data)).catch(console.error);

  useEffect(() => {
    fetchProducts();
    api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      emri: form.emri,
      kategoria_id: form.kategoria_id || null,
      marka: form.marka || null,
      modeli: form.modeli || null,
      pershkrimi: form.pershkrimi || null,
      cmimi: Number(form.cmimi),
      cmimi_zbritjes: form.cmimi_zbritjes ? Number(form.cmimi_zbritjes) : null,
      sasia_stokut: form.sasia_stokut ? Number(form.sasia_stokut) : 0,
      garancia_muaj: form.garancia_muaj ? Number(form.garancia_muaj) : 0,
    };
    const req = editId ? api.put(`/products/${editId}`, payload) : api.post('/products', payload);
    req.then(() => { setEditId(null); setForm(empty); fetchProducts(); }).catch(console.error);
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
              <button onClick={() => { setEditId(null); setForm(empty); }} style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', textDecoration: 'underline' }}>Cancel</button>
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
            <button type="submit" className="btn-add">{editId ? 'Update Product' : 'Add Product'}</button>
          </form>
        </>
      )}

      {products.map(p => (
        <div key={p.id} className="list-row">
          <span>{p.emri} — {p.cmimi}€ {p.kategoria_emri ? `· ${p.kategoria_emri}` : ''} · stock: {p.sasia_stokut}</span>
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