import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';
import Modal from './Modal';

const STATUSES = ['hapur', 'ne_proces', 'zgjidhur', 'mbyllur', 'anuluar'];
const PRIORITIES = ['i_ulet', 'normal', 'i_larte', 'urgjent'];
const STATUS_COLORS = {
  hapur: ['#dbeafe', '#1d4ed8'], ne_proces: ['#fef9c3', '#a16207'],
  zgjidhur: ['#dcfce7', '#15803d'], mbyllur: ['#f1f5f9', '#475569'],
  anuluar: ['#fee2e2', '#dc2626'],
};
const PRIORITY_COLORS = {
  i_ulet: ['#f1f5f9', '#475569'], normal: ['#e0f2fe', '#0369a1'],
  i_larte: ['#fef9c3', '#a16207'], urgjent: ['#fee2e2', '#dc2626'],
};

const emptyForm = { customer_id: '', product_id: '', warranty_id: '', technician_id: '', problemi: '', prioriteti: 'normal' };
const editEmpty = { statusi: '', diagnoza: '', technician_id: '', cmimi_servisit: '', shenime: '', data_perfundim: '' };
const inp = { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 };
const lbl = { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 };

function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [addForm, setAddForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(editEmpty);
  const [filterStatus, setFilterStatus] = useState('');
  const { isAdmin, isTechnician } = useRole();

  const fetch = () => api.get('/service-requests').then(r => setRequests(r.data)).catch(console.error);

  useEffect(() => {
    fetch();
    api.get('/customers').then(r => setCustomers(r.data)).catch(console.error);
    api.get('/products').then(r => setProducts(r.data)).catch(console.error);
    api.get('/users').then(r => setTechnicians(r.data.filter(u => u.roles?.includes('Technician') || u.roles?.includes('Admin')))).catch(console.error);
  }, []);

  const setA = f => e => setAddForm(p => ({ ...p, [f]: e.target.value }));
  const setE = f => e => setEditForm(p => ({ ...p, [f]: e.target.value }));

  const handleAdd = e => {
    e.preventDefault();
    api.post('/service-requests', {
      customer_id: Number(addForm.customer_id),
      product_id: Number(addForm.product_id),
      warranty_id: addForm.warranty_id ? Number(addForm.warranty_id) : null,
      technician_id: addForm.technician_id ? Number(addForm.technician_id) : null,
      problemi: addForm.problemi,
      prioriteti: addForm.prioriteti,
    }).then(() => { setAddOpen(false); setAddForm(emptyForm); fetch(); }).catch(console.error);
  };

  const openEdit = req => {
    setEditId(req.id);
    setEditForm({
      statusi: req.statusi || '',
      diagnoza: req.diagnoza || '',
      technician_id: req.technician_id ? String(req.technician_id) : '',
      cmimi_servisit: req.cmimi_servisit ?? '',
      shenime: req.shenime || '',
      data_perfundim: req.data_perfundim ? req.data_perfundim.slice(0, 16) : '',
    });
  };

  const handleEdit = e => {
    e.preventDefault();
    api.put(`/service-requests/${editId}`, {
      statusi: editForm.statusi || null,
      diagnoza: editForm.diagnoza || null,
      technician_id: editForm.technician_id ? Number(editForm.technician_id) : null,
      cmimi_servisit: editForm.cmimi_servisit !== '' ? Number(editForm.cmimi_servisit) : null,
      shenime: editForm.shenime || null,
      data_perfundim: editForm.data_perfundim || null,
    }).then(() => { setEditId(null); fetch(); }).catch(console.error);
  };

  const handleDelete = id => {
    if (!window.confirm('Fshi këtë kërkesë?')) return;
    api.delete(`/service-requests/${id}`).then(fetch).catch(console.error);
  };

  const filtered = filterStatus ? requests.filter(r => r.statusi === filterStatus) : requests;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Kërkesat e Servisit</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{requests.length} kërkesa gjithsej</p>
        </div>
        <button onClick={() => setAddOpen(true)}
          style={{ padding: '9px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          + Shto Kërkesë
        </button>
      </div>

      {/* Status filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['', ...STATUSES].map(s => {
          const active = filterStatus === s;
          const [bg, color] = s ? (STATUS_COLORS[s] || ['#f1f5f9', '#475569']) : ['#4f46e5', 'white'];
          return (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${active ? (s ? color : '#4f46e5') : '#e2e8f0'}`, background: active ? (s ? bg : '#4f46e5') : 'white', color: active ? (s ? color : 'white') : '#64748b', fontSize: 12, fontWeight: active ? 700 : 400, cursor: 'pointer' }}>
              {s || 'Të gjitha'} {s && `(${requests.filter(r => r.statusi === s).length})`}
            </button>
          );
        })}
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['ID', 'Klienti', 'Produkti', 'Problemi', 'Prioriteti', 'Statusi', 'Teknikisti', 'Çmimi', 'Data', 'Veprimet'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Nuk ka kërkesa</td></tr>
            ) : filtered.map(r => {
              const [sbg, scol] = STATUS_COLORS[r.statusi] || ['#f1f5f9', '#475569'];
              const [pbg, pcol] = PRIORITY_COLORS[r.prioriteti] || ['#f1f5f9', '#475569'];
              return (
                <tr key={r.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13 }}>#{r.id}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{r.customer_emri || '—'}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{r.produkt_emri || '—'}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13, maxWidth: 200 }}>{r.problemi}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: pbg, color: pcol, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{r.prioriteti}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: sbg, color: scol, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{r.statusi}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{r.technician_emri || '—'}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{r.cmimi_servisit ? `${parseFloat(r.cmimi_servisit).toFixed(2)}€` : '—'}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13 }}>{new Date(r.created_at).toLocaleDateString('sq-AL')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => openEdit(r)}
                      style={{ padding: '4px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, color: '#1d4ed8', fontSize: 12, cursor: 'pointer', marginRight: 6 }}>
                      Ndrysho
                    </button>
                    {isAdmin && (
                      <button onClick={() => handleDelete(r.id)}
                        style={{ padding: '4px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#dc2626', fontSize: 12, cursor: 'pointer' }}>
                        Fshi
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <Modal isOpen={addOpen} onClose={() => { setAddOpen(false); setAddForm(emptyForm); }} title="Shto Kërkesë Servisi">
        <form onSubmit={handleAdd}>
          <div>
            <label style={lbl}>Klienti *</label>
            <select required style={inp} value={addForm.customer_id} onChange={setA('customer_id')}>
              <option value="">Zgjidh klientin</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.emri} {c.mbiemri}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Produkti *</label>
            <select required style={inp} value={addForm.product_id} onChange={setA('product_id')}>
              <option value="">Zgjidh produktin</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.emri}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Teknikisti</label>
            <select style={inp} value={addForm.technician_id} onChange={setA('technician_id')}>
              <option value="">Pa teknikist</option>
              {technicians.map(t => <option key={t.id} value={t.id}>{t.emri} {t.mbiemri}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Prioriteti</label>
            <select style={inp} value={addForm.prioriteti} onChange={setA('prioriteti')}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Problemi *</label>
            <textarea required style={{ ...inp, minHeight: 80, resize: 'vertical' }} value={addForm.problemi} onChange={setA('problemi')} placeholder="Përshkrimi i problemit..." />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{ flex: 1, padding: 11, background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Shto Kërkesën</button>
            <button type="button" onClick={() => { setAddOpen(false); setAddForm(emptyForm); }} style={{ padding: '11px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, color: '#64748b', fontSize: 14, cursor: 'pointer' }}>Anulo</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editId} onClose={() => setEditId(null)} title="Ndrysho Kërkesën">
        <form onSubmit={handleEdit}>
          <div>
            <label style={lbl}>Statusi</label>
            <select style={inp} value={editForm.statusi} onChange={setE('statusi')}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Teknikisti</label>
            <select style={inp} value={editForm.technician_id} onChange={setE('technician_id')}>
              <option value="">Pa teknikist</option>
              {technicians.map(t => <option key={t.id} value={t.id}>{t.emri} {t.mbiemri}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Diagnoza</label><textarea style={{ ...inp, minHeight: 72, resize: 'vertical' }} value={editForm.diagnoza} onChange={setE('diagnoza')} placeholder="Diagnoza teknike..." /></div>
          <div><label style={lbl}>Çmimi i Servisit (€)</label><input type="number" step="0.01" style={inp} value={editForm.cmimi_servisit} onChange={setE('cmimi_servisit')} placeholder="0.00" /></div>
          <div><label style={lbl}>Data e Përfundimit</label><input type="datetime-local" style={inp} value={editForm.data_perfundim} onChange={setE('data_perfundim')} /></div>
          <div><label style={lbl}>Shënime</label><textarea style={{ ...inp, minHeight: 60, resize: 'vertical' }} value={editForm.shenime} onChange={setE('shenime')} /></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{ flex: 1, padding: 11, background: '#4f46e5', border: 'none', borderRadius: 10, color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Ruaj Ndryshimet</button>
            <button type="button" onClick={() => setEditId(null)} style={{ padding: '11px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, color: '#64748b', fontSize: 14, cursor: 'pointer' }}>Anulo</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ServiceRequests;