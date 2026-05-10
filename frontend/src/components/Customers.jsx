import { useEffect, useState } from 'react';
import api from '../api/axios';

const empty = { emri: '', mbiemri: '', email: '', telefoni: '', adresa: '', qyteti: '' };

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);

  const fetchCustomers = () => api.get('/customers').then(res => setCustomers(res.data)).catch(console.error);

  useEffect(() => { fetchCustomers(); }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const req = editId ? api.put(`/customers/${editId}`, form) : api.post('/customers', form);
    req.then(() => { setEditId(null); setForm(empty); fetchCustomers(); }).catch(console.error);
  };

  const handleEdit = (c) => {
    setEditId(c.id);
    setForm({ emri: c.emri || '', mbiemri: c.mbiemri || '', email: c.email || '', telefoni: c.telefoni || '', adresa: c.adresa || '', qyteti: c.qyteti || '' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this customer?')) return;
    api.delete(`/customers/${id}`).then(() => setCustomers(prev => prev.filter(c => c.id !== id))).catch(console.error);
  };

  return (
    <div>
      <h2>Customers</h2>

      {editId && (
        <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, padding: '8px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
          <span>Editing customer #{editId}</span>
          <button onClick={() => { setEditId(null); setForm(empty); }} style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', textDecoration: 'underline' }}>Cancel</button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input required placeholder="First name *" value={form.emri} onChange={set('emri')} />
        <input required placeholder="Last name *" value={form.mbiemri} onChange={set('mbiemri')} />
        <input type="email" placeholder="Email" value={form.email} onChange={set('email')} />
        <input placeholder="Phone" value={form.telefoni} onChange={set('telefoni')} />
        <input placeholder="Address" value={form.adresa} onChange={set('adresa')} />
        <input placeholder="City" value={form.qyteti} onChange={set('qyteti')} />
        <button type="submit" className="btn-add">{editId ? 'Update Customer' : 'Add Customer'}</button>
      </form>

      {customers.map(c => (
        <div key={c.id} className="list-row">
          <span>{c.emri} {c.mbiemri} {c.email ? `— ${c.email}` : ''} {c.qyteti ? `· ${c.qyteti}` : ''}</span>
          <span>
            <button className="btn-edit" onClick={() => handleEdit(c)}>Edit</button>
            <button className="btn-delete" onClick={() => handleDelete(c.id)}>Delete</button>
          </span>
        </div>
      ))}
    </div>
  );
}

export default Customers;