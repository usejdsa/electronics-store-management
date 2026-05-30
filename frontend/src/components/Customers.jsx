import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';
import Modal from './Modal';

const empty = { emri: '', mbiemri: '', email: '', telefoni: '', adresa: '', qyteti: '' };
const inp = { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 };
const label = { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 };

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { can } = useRole();
  const canMutate = can('mutate:customers');
  const canDelete = can('delete:customers');

  const fetchCustomers = () => api.get('/customers').then(res => setCustomers(res.data)).catch(console.error);

  useEffect(() => { fetchCustomers(); }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const openAdd = () => { setEditId(null); setForm(empty); setModalOpen(true); };
  const openEdit = (c) => {
    setEditId(c.id);
    setForm({ emri: c.emri || '', mbiemri: c.mbiemri || '', email: c.email || '', telefoni: c.telefoni || '', adresa: c.adresa || '', qyteti: c.qyteti || '' });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditId(null); setForm(empty); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const req = editId ? api.put(`/customers/${editId}`, form) : api.post('/customers', form);
    req.then(() => { closeModal(); fetchCustomers(); }).catch(console.error);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Fshi këtë klient?')) return;
    api.delete(`/customers/${id}`).then(() => setCustomers(prev => prev.filter(c => c.id !== id))).catch(console.error);
  };

  const filtered = customers.filter(c =>
    `${c.emri} ${c.mbiemri} ${c.email} ${c.qyteti}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Klientët</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{customers.length} klientë gjithsej</p>
        </div>
        {canMutate && (
          <button onClick={openAdd} style={{ padding: '9px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            + Shto Klient
          </button>
        )}
      </div>

      {/* Kërkim */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🔍</span>
        <input
          placeholder="Kërko klient..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['ID', 'Emri', 'Email', 'Telefoni', 'Qyteti', 'Veprimet'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Nuk ka klientë</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13 }}>#{c.id}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#4f46e5', flexShrink: 0 }}>
                      {c.emri?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 500, color: '#0f172a' }}>{c.emri} {c.mbiemri}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{c.email || '—'}</td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{c.telefoni || '—'}</td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{c.qyteti || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  {canMutate && <button onClick={() => openEdit(c)} style={{ padding: '4px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, color: '#1d4ed8', fontSize: 12, cursor: 'pointer', marginRight: 6 }}>Ndrysho</button>}
                  {canDelete && <button onClick={() => handleDelete(c.id)} style={{ padding: '4px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#dc2626', fontSize: 12, cursor: 'pointer' }}>Fshi</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editId ? 'Ndrysho Klientin' : 'Shto Klient të Ri'}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={label}>Emri *</label><input required style={inp} value={form.emri} onChange={set('emri')} placeholder="Besnik" /></div>
            <div><label style={label}>Mbiemri *</label><input required style={inp} value={form.mbiemri} onChange={set('mbiemri')} placeholder="Krasniqi" /></div>
            <div><label style={label}>Email</label><input type="email" style={inp} value={form.email} onChange={set('email')} placeholder="email@gmail.com" /></div>
            <div><label style={label}>Telefoni</label><input style={inp} value={form.telefoni} onChange={set('telefoni')} placeholder="+383 44 000 000" /></div>
            <div><label style={label}>Adresa</label><input style={inp} value={form.adresa} onChange={set('adresa')} placeholder="Rruga Prishtina" /></div>
            <div><label style={label}>Qyteti</label><input style={inp} value={form.qyteti} onChange={set('qyteti')} placeholder="Prishtinë" /></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{ flex: 1, padding: 11, background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              {editId ? 'Ruaj Ndryshimet' : 'Shto Klientin'}
            </button>
            <button type="button" onClick={closeModal} style={{ padding: '11px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, color: '#64748b', fontSize: 14, cursor: 'pointer' }}>Anulo</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Customers;