import { useEffect, useState } from 'react';
import { useLang } from '../context/LangContext';
import api from '../api/axios';
import { useRole } from '../hooks/useRole';

const empty = { product_id: '', lloji: 'hyrje', sasia: '', shenime: '' };

const TYPE_STYLE = {
  hyrje:     { bg: '#dcfce7', color: '#15803d', label: 'Stock In' },
  dalje:     { bg: '#fee2e2', color: '#dc2626', label: 'Stock Out' },
  rregullim: { bg: '#e0e7ff', color: '#4338ca', label: 'Adjustment' },
};

const SOURCE_STYLE = {
  PurchaseOrder: { bg: '#dbeafe', color: '#1d4ed8' },
  Order:         { bg: '#fef9c3', color: '#a16207' },
  Manual:        { bg: '#f1f5f9', color: '#475569' },
};

const inp = {
  padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8,
  fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'white',
};

function Inventory() {
  const [items, setItems]       = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm]         = useState(empty);
  const [filterType, setFilterType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState('');
  const { t } = useLang();
  const { can } = useRole();
  const canMutate = can('mutate:inventory');

  const fetchData = () => {
    api.get('/inventory').then(r => setItems(r.data)).catch(console.error);
    api.get('/products').then(r => setProducts(r.data)).catch(console.error);
  };

  useEffect(() => { fetchData(); }, []);

  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    if (!form.shenime.trim()) {
      setError('Arsyeja është e detyrueshme për audit.');
      return;
    }
    setSubmitting(true);
    api.post('/inventory', {
      product_id: Number(form.product_id),
      lloji: form.lloji,
      sasia: Math.abs(Number(form.sasia)),
      shenime: form.shenime,
    })
      .then(() => { setForm(empty); fetchData(); })
      .catch(err => setError(err.response?.data?.message || 'Gabim gjatë regjistrimit.'))
      .finally(() => setSubmitting(false));
  };

  const filtered = filterType ? items.filter(i => i.lloji === filterType) : items;

  return (
    <div>
      {/* Titulli */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Inventari</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{items.length} lëvizje të regjistruara</p>
        </div>
      </div>

      {/* Paralajmërim informues */}
      <div style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#92400e' }}>
        Lëvizjet e stokut krijohen automatikisht kur një Porosi Furnizimi shënohet si <strong>received</strong> (hyrje stoku) ose kur plotësohet një porosi klienti (dalje stoku). Përdor formularin më poshtë vetëm për korrigjime manuale.
      </div>

      {/* Formulari i korrigjimit manual */}
      {canMutate && (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12 }}>Korrigjim Manual i Stokut</div>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: 13, color: '#dc2626' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '2 1 200px' }}>
              <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Produkti *</label>
              <select required value={form.product_id} onChange={set('product_id')} style={{ ...inp, width: '100%' }}>
                <option value="">Zgjidh Produktin</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.emri} (stok: {p.sasia_stokut})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 120px' }}>
              <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Lloji *</label>
              <select required value={form.lloji} onChange={set('lloji')} style={{ ...inp, width: '100%' }}>
                <option value="hyrje">Hyrje (+)</option>
                <option value="dalje">Dalje (−)</option>
                <option value="rregullim">Rregullim</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 100px' }}>
              <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Sasia *</label>
              <input
                required type="number" min="1" placeholder="p.sh. 5"
                value={form.sasia} onChange={set('sasia')}
                style={{ ...inp, width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '2 1 200px' }}>
              <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Arsyeja (e detyrueshme) *</label>
              <input
                required placeholder="p.sh. Diferenca nga inventarizimi fizik"
                value={form.shenime} onChange={set('shenime')}
                style={{ ...inp, width: '100%' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '9px 18px', background: submitting ? '#a5b4fc' : '#4f46e5',
                color: 'white', border: 'none', borderRadius: 8, fontSize: 13,
                fontWeight: 600, cursor: submitting ? 'default' : 'pointer',
                alignSelf: 'flex-end', flexShrink: 0,
              }}
            >
              {submitting ? 'Duke ruajtur...' : 'Apliko Korrigjimin'}
            </button>
          </form>
        </div>
      )}

      {/* Filtrat */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: '#64748b' }}>Filtro:</span>
        {['', 'hyrje', 'dalje', 'rregullim'].map(ftype => (
          <button
            key={ftype}
            onClick={() => setFilterType(ftype)}
            style={{
              padding: '4px 12px', borderRadius: 8, border: '1px solid',
              fontSize: 12, cursor: 'pointer',
              fontWeight: filterType === ftype ? 700 : 400,
              background: filterType === ftype ? '#4f46e5' : 'white',
              color: filterType === ftype ? 'white' : '#64748b',
              borderColor: filterType === ftype ? '#4f46e5' : '#e2e8f0',
            }}
          >
            {ftype === '' ? 'Të gjitha' : (TYPE_STYLE[ftype]?.label ?? ftype)}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8' }}>{filtered.length} regjistrime</span>
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.length === 0 && (
          <div style={{ color: '#94a3b8', fontSize: 13, padding: '32px 0', textAlign: 'center' }}>
            Nuk ka regjistrime.
          </div>
        )}
        {filtered.map(i => {
          const type   = TYPE_STYLE[i.lloji]   || { bg: '#f1f5f9', color: '#475569', label: i.lloji };
          const source = SOURCE_STYLE[i.referenca_lloji] || SOURCE_STYLE.Manual;
          const sign   = i.lloji === 'hyrje' ? '+' : i.lloji === 'dalje' ? '−' : '±';
          const date   = new Date(i.created_at);
          return (
            <div
              key={i.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'white', border: '1px solid #f1f5f9', borderRadius: 10,
                padding: '10px 14px',
              }}
            >
              <span style={{ background: type.bg, color: type.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                {type.label}
              </span>
              <span style={{ fontWeight: 600, color: '#0f172a', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {i.produkt_emri}
              </span>
              <span style={{ fontWeight: 700, fontSize: 15, color: i.lloji === 'hyrje' ? '#15803d' : i.lloji === 'dalje' ? '#dc2626' : '#4338ca', minWidth: 44, textAlign: 'right', flexShrink: 0 }}>
                {sign}{Math.abs(i.sasia)}
              </span>
              <span style={{ background: source.bg, color: source.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                {i.referenca_lloji || 'Manual'}
              </span>
              {i.shenime && (
                <span style={{ fontSize: 12, color: '#64748b', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {i.shenime}
                </span>
              )}
              {i.user_emri && (
                <span style={{ fontSize: 12, color: '#94a3b8', flexShrink: 0 }}>nga {i.user_emri}</span>
              )}
              <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>
                {date.toLocaleDateString('sq-AL')} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Inventory;