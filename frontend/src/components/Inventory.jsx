import { useEffect, useState } from 'react';
import api from '../api/axios';

const empty = { product_id: '', lloji: 'hyrje', sasia: '', shenime: '' };

function Inventory() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);

  const fetchData = () => {
    api.get('/inventory').then(res => setItems(res.data)).catch(console.error);
    api.get('/products').then(res => setProducts(res.data)).catch(console.error);
  };

  useEffect(() => { fetchData(); }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { product_id: Number(form.product_id), lloji: form.lloji, sasia: Number(form.sasia), shenime: form.shenime || null };
    api.post('/inventory', payload).then(() => { setForm(empty); fetchData(); }).catch(console.error);
  };

  const llojiBadge = { hyrje: '#dcfce7', dalje: '#fee2e2', rregullim: '#e0e7ff' };

  return (
    <div>
      <h2>Inventory</h2>

      <form onSubmit={handleSubmit}>
        <select required value={form.product_id} onChange={set('product_id')}>
          <option value="">Select Product *</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.emri} (stock: {p.sasia_stokut})</option>)}
        </select>
        <select value={form.lloji} onChange={set('lloji')}>
          <option value="hyrje">Hyrje (Stock In)</option>
          <option value="dalje">Dalje (Stock Out)</option>
          <option value="rregullim">Rregullim (Adjustment)</option>
        </select>
        <input required type="number" placeholder="Quantity *" value={form.sasia} onChange={set('sasia')} />
        <input placeholder="Notes" value={form.shenime} onChange={set('shenime')} />
        <button type="submit" className="btn-add">Add Movement</button>
      </form>

      {items.map(i => (
        <div key={i.id} className="list-row">
          <span>
            <span style={{ background: llojiBadge[i.lloji] || '#f1f5f9', borderRadius: 4, padding: '2px 7px', fontSize: 12, marginRight: 8 }}>{i.lloji}</span>
            {i.produkt_emri} — qty: {i.sasia} {i.shenime ? `(${i.shenime})` : ''} {i.user_emri ? `· by ${i.user_emri}` : ''}
          </span>
        </div>
      ))}
    </div>
  );
}

export default Inventory;