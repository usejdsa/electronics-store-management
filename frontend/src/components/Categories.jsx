import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';

const empty = { emertimi: '', pershkrimi: '', kategoria_prind_id: '', ikona: '' };

function Categories() {
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const { can } = useRole();

  const canMutate = can('mutate:categories');

  const fetchCategories = () => api.get('/categories').then(res => setCategories(Array.isArray(res.data) ? res.data : [])).catch(console.error);

  useEffect(() => { fetchCategories(); }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { emertimi: form.emertimi, pershkrimi: form.pershkrimi || null, kategoria_prind_id: form.kategoria_prind_id || null, ikona: form.ikona || null };
    const req = editId ? api.put(`/categories/${editId}`, payload) : api.post('/categories', payload);
    req.then(() => { setEditId(null); setForm(empty); fetchCategories(); }).catch(console.error);
  };

  const handleEdit = (c) => {
    setEditId(c.id);
    setForm({ emertimi: c.emertimi || '', pershkrimi: c.pershkrimi || '', kategoria_prind_id: c.kategoria_prind_id || '', ikona: c.ikona || '' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this category?')) return;
    api.delete(`/categories/${id}`).then(() => setCategories(prev => prev.filter(c => c.id !== id))).catch(console.error);
  };

  return (
    <div>
      <h2>Categories</h2>

      {canMutate && (
        <>
          {editId && (
            <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, padding: '8px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
              <span>Editing category #{editId}</span>
              <button onClick={() => { setEditId(null); setForm(empty); }} style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', textDecoration: 'underline' }}>Cancel</button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input required placeholder="Name *" value={form.emertimi} onChange={set('emertimi')} />
            <input placeholder="Description" value={form.pershkrimi} onChange={set('pershkrimi')} />
            <select value={form.kategoria_prind_id} onChange={set('kategoria_prind_id')}>
              <option value="">No parent (top-level)</option>
              {categories.filter(c => c.id !== editId && !c.kategoria_prind_id).map(c => <option key={c.id} value={c.id}>{c.emertimi}</option>)}
            </select>
            <input placeholder="Icon" value={form.ikona} onChange={set('ikona')} />
            <button type="submit" className="btn-add">{editId ? 'Update Category' : 'Add Category'}</button>
          </form>
        </>
      )}

      {categories.map(c => (
        <div key={c.id} className="list-row">
          <span>{c.emertimi} {c.pershkrimi ? `— ${c.pershkrimi}` : ''} {c.kategoria_prind_id ? '(sub)' : ''}</span>
          {canMutate && (
            <span>
              <button className="btn-edit" onClick={() => handleEdit(c)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(c.id)}>Delete</button>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default Categories;