import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';

const empty = { emri_kompanise: '', kontakti: '', email: '', telefoni: '', adresa: '' };

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const { can } = useRole();

  const canMutate = can('mutate:suppliers');

  const fetchSuppliers = () => api.get('/suppliers').then(res => setSuppliers(res.data)).catch(console.error);

  useEffect(() => { fetchSuppliers(); }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const req = editId ? api.put(`/suppliers/${editId}`, form) : api.post('/suppliers', form);
    req.then(() => { setEditId(null); setForm(empty); fetchSuppliers(); }).catch(console.error);
  };

  const handleEdit = (s) => {
    setEditId(s.id);
    setForm({ emri_kompanise: s.emri_kompanise || '', kontakti: s.kontakti || '', email: s.email || '', telefoni: s.telefoni || '', adresa: s.adresa || '' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    api.delete(`/suppliers/${id}`).then(fetchSuppliers).catch(console.error);
  };

  return (
    <div>
      <h2>Suppliers</h2>

      {canMutate && (
        <>
          {editId && (
            <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, padding: '8px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
              <span>Editing supplier #{editId}</span>
              <button onClick={() => { setEditId(null); setForm(empty); }} style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', textDecoration: 'underline' }}>Cancel</button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input required placeholder="Company name *" value={form.emri_kompanise} onChange={set('emri_kompanise')} />
            <input placeholder="Contact person" value={form.kontakti} onChange={set('kontakti')} />
            <input type="email" placeholder="Email" value={form.email} onChange={set('email')} />
            <input placeholder="Phone" value={form.telefoni} onChange={set('telefoni')} />
            <input placeholder="Address" value={form.adresa} onChange={set('adresa')} />
            <button type="submit" className="btn-add">{editId ? 'Update Supplier' : 'Add Supplier'}</button>
          </form>
        </>
      )}

      {suppliers.map(s => (
        <div key={s.id} className="list-row">
          <span>{s.emri_kompanise} {s.kontakti ? `— ${s.kontakti}` : ''} {s.email ? `· ${s.email}` : ''}</span>
          {canMutate && (
            <span>
              <button className="btn-edit" onClick={() => handleEdit(s)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(s.id)}>Delete</button>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default Suppliers;