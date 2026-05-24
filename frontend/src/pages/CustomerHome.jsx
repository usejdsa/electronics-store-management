import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../hooks/useRole';
import api from '../api/axios';

function Navbar({ active, setActive, user, logout, isStaff, navigate }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid #f1f5f9' : 'none',
      boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,0.06)' : 'none',
      transition: 'all 0.3s',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: scrolled ? '#1e293b' : 'white' }}>ElectroStore</span>
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          {[['home','Home'],['products','Produktet'],['about','Rreth Nesh'],['contact','Kontakti']].map(([k,l]) => (
            <button key={k} onClick={() => setActive(k)} style={{
              padding: '7px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: active === k ? 600 : 400,
              background: active === k ? (scrolled ? '#eef2ff' : 'rgba(255,255,255,0.15)') : 'transparent',
              color: active === k ? (scrolled ? '#4f46e5' : 'white') : (scrolled ? '#64748b' : 'rgba(255,255,255,0.75)'),
              transition: 'all 0.15s',
            }}>{l}</button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isStaff && (
            <button onClick={() => navigate('/dashboard')} style={{ padding: '7px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
              Dashboard →
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: scrolled ? '#f8fafc' : 'rgba(255,255,255,0.1)', border: `1px solid ${scrolled ? '#e2e8f0' : 'rgba(255,255,255,0.2)'}`, borderRadius: 10 }}>
            <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>
              {user?.emri?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: scrolled ? '#374151' : 'white' }}>{user?.emri}</span>
          </div>
          <button onClick={logout} style={{ padding: '7px 12px', background: 'transparent', border: `1px solid ${scrolled ? '#fecaca' : 'rgba(255,255,255,0.2)'}`, borderRadius: 10, color: scrolled ? '#ef4444' : 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer' }}>
            Dil
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero({ setActive, user }) {
  return (
    <section style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1a0533 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'rgba(99,102,241,0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 300, height: 300, background: 'rgba(139,92,246,0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ textAlign: 'center', maxWidth: 800, padding: '0 24px', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: '6px 16px', marginBottom: 28, fontSize: 13, color: '#a5b4fc', fontWeight: 500 }}>
          <span style={{ width: 6, height: 6, background: '#818cf8', borderRadius: '50%' }} />
          Mirësevini, {user?.emri}!
        </div>

        <h1 style={{ fontSize: 60, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 20 }}>
          Teknologjia më e re,{' '}
          <span style={{ background: 'linear-gradient(90deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            çmimi më i mirë
          </span>
        </h1>

        <p style={{ color: '#94a3b8', fontSize: 20, maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.6 }}>
          Zbulo gamën tonë të gjerë të produkteve elektronike me garanci origjinale dhe shërbim profesional.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 64 }}>
          <button onClick={() => setActive('products')} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', borderRadius: 14, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 24px rgba(79,70,229,0.4)' }}>
            Shiko Produktet →
          </button>
          <button onClick={() => setActive('about')} style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, color: 'white', fontSize: 16, cursor: 'pointer' }}>
            Rreth Nesh
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32, maxWidth: 480, margin: '0 auto' }}>
          {[['500+','Produkte'],['24/7','Support'],['2 vit','Garanci'],['10k+','Klientë']].map(([v,l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'white' }}>{v}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const productIcons = ['📱','💻','🖥️','⌚','📷','🎧','🖨️','🔋','🖱️','⌨️','📺','🎮'];

  useEffect(() => {
    api.get('/store/categories').then(r => setCategories(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = {};
    if (selectedCat) params.kategoria_id = selectedCat;
    if (search) params.search = search;
    api.get('/store/products', { params })
      .then(r => { setProducts(r.data); })
      .catch(err => { setError('Gabim gjatë ngarkimit: ' + (err.response?.data?.message || err.message)); })
      .finally(() => setLoading(false));
  }, [selectedCat, search]);

  return (
    <section style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', paddingTop: 88, paddingBottom: 32, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Katalogu</div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>Produktet Tona</h2>
          <p style={{ color: '#64748b', fontSize: 15, margin: 0 }}>Gjej produktin e duhur për ty</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🔍</span>
            <input
              placeholder="Kërko produkt..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: 40, paddingRight: 16, paddingTop: 11, paddingBottom: 11, border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            />
          </div>
          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            style={{ padding: '11px 16px', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, color: '#374151', outline: 'none', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', cursor: 'pointer' }}
          >
            <option value="">Të gjitha kategoritë</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.emertimi} ({c.numri_produkteve})</option>)}
          </select>
          {(search || selectedCat) && (
            <button onClick={() => { setSearch(''); setSelectedCat(''); }} style={{ padding: '11px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 13, cursor: 'pointer', color: '#64748b' }}>
              ✕ Pastro
            </button>
          )}
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '16px 20px', marginBottom: 24, color: '#dc2626', fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                <div style={{ height: 160, background: '#f1f5f9' }} />
                <div style={{ padding: 16 }}>
                  <div style={{ height: 10, background: '#f1f5f9', borderRadius: 6, marginBottom: 8, width: '40%' }} />
                  <div style={{ height: 14, background: '#f1f5f9', borderRadius: 6, marginBottom: 6, width: '80%' }} />
                  <div style={{ height: 10, background: '#f1f5f9', borderRadius: 6, width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
            <div style={{ fontWeight: 500 }}>Nuk u gjetën produkte</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {products.map((p, i) => (
              <div key={p.id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid #f1f5f9', transition: 'all 0.25s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ height: 160, background: 'linear-gradient(135deg, #f0f4ff, #ede9fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  {p.foto_kryesore
                    ? <img src={p.foto_kryesore} alt={p.emri} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                    : null
                  }
                  <div style={{ fontSize: 52, display: p.foto_kryesore ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: p.foto_kryesore ? 'absolute' : 'relative', top: 0 }}>
                    {productIcons[i % productIcons.length]}
                  </div>
                  {p.cmimi_zbritjes && (
                    <div style={{ position: 'absolute', top: 10, left: 10, background: '#ef4444', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 8 }}>ZBRITJE</div>
                  )}
                  <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 8, background: p.sasia_stokut > 5 ? '#dcfce7' : '#fef9c3', color: p.sasia_stokut > 5 ? '#15803d' : '#a16207' }}>
                    {p.sasia_stokut > 5 ? '● Në stok' : `● ${p.sasia_stokut} mbetur`}
                  </div>
                </div>

                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{p.kategoria || 'Elektronikë'}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.emri}</h3>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{p.marka} {p.modeli}</div>
                  {p.pershkrimi && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>{p.pershkrimi}</div>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <div>
                      {p.cmimi_zbritjes ? (
                        <>
                          <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{p.cmimi_zbritjes}€</div>
                          <div style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>{p.cmimi}€</div>
                        </>
                      ) : (
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{p.cmimi}€</div>
                      )}
                    </div>
                    {p.garancia_muaj && <div style={{ fontSize: 12, color: '#64748b' }}>🛡️ {p.garancia_muaj}m</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function About() {
  const values = [
    { icon: '🏆', title: 'Cilësi e Lartë', desc: 'Vetëm produkte origjinale nga brendet botërore.' },
    { icon: '🔧', title: 'Servis Profesional', desc: 'Ekipi teknik me mbi 10 vjet përvojë.' },
    { icon: '🚀', title: 'Dorëzim i Shpejtë', desc: 'Dorëzim brenda 24-48 orësh.' },
    { icon: '💰', title: 'Çmime Konkuruese', desc: 'Çmimet më të mira në treg.' },
    { icon: '🔄', title: 'Kthim i Lehtë', desc: 'Kthe produktin brenda 30 ditëve.' },
    { icon: '🛡️', title: 'Garanci Origjinale', desc: 'Garanci origjinale e prodhuesit.' },
  ];

  return (
    <section style={{ minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', padding: '88px 24px 60px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Rreth Nesh</div>
        <h2 style={{ fontSize: 48, fontWeight: 900, color: 'white', marginBottom: 16 }}>Dyqani juaj i <span style={{ background: 'linear-gradient(90deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>besueshëm</span></h2>
        <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 560, margin: '0 auto' }}>Që nga viti 2015, mbi 10,000 klientë të kënaqur në Kosovë.</p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 56 }}>
          {values.map(v => (
            <div key={v.title} style={{ padding: 24, background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, transition: 'all 0.2s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{v.icon}</div>
              <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 6, fontSize: 16 }}>{v.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h3 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Ekipi Ynë</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 680, margin: '0 auto' }}>
          {[
            { name: 'Besnik Krasniqi', role: 'CEO & Themelues', emoji: '👨‍💼', color: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
            { name: 'Ardita Hoxha', role: 'Menaxhere Teknike', emoji: '👩‍💻', color: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
            { name: 'Liridon Berisha', role: 'Specialist Shitjesh', emoji: '👨‍💼', color: 'linear-gradient(135deg,#06b6d4,#0284c7)' },
          ].map(t => (
            <div key={t.name} style={{ textAlign: 'center', padding: 24, background: 'white', border: '1px solid #e2e8f0', borderRadius: 16 }}>
              <div style={{ width: 72, height: 72, background: t.color, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 12px' }}>{t.emoji}</div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>{t.name}</div>
              <div style={{ color: '#6366f1', fontSize: 13, marginTop: 4 }}>{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ emri: '', email: '', mesazhi: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ emri: '', email: '', mesazhi: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', padding: '88px 24px 60px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Kontakti</div>
        <h2 style={{ fontSize: 48, fontWeight: 900, color: 'white', marginBottom: 12 }}>Na Kontaktoni</h2>
        <p style={{ color: '#94a3b8', fontSize: 18 }}>Jemi këtu për t'ju ndihmuar çdo ditë</p>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: '📍', title: 'Adresa', val: 'Rruga Prishtina, Nr. 15\nPrishtinë, Kosovë', bg: '#eff6ff', border: '#bfdbfe' },
              { icon: '📞', title: 'Telefoni', val: '+383 44 000 000\n+383 38 000 000', bg: '#f0fdf4', border: '#bbf7d0' },
              { icon: '✉️', title: 'Email', val: 'info@electrostore.com\nsupport@electrostore.com', bg: '#faf5ff', border: '#e9d5ff' },
              { icon: '🕐', title: 'Orari', val: 'E Hënë – E Premte: 08:00 – 20:00\nE Shtunë: 09:00 – 16:00', bg: '#fffbeb', border: '#fde68a' },
            ].map(c => (
              <div key={c.title} style={{ display: 'flex', gap: 14, padding: '16px 20px', background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14 }}>
                <div style={{ fontSize: 24, marginTop: 2 }}>{c.icon}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{c.val}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 24, marginTop: 0 }}>Dërgo Mesazh</h3>
            {sent && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#15803d', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                ✅ Mesazhi u dërgua! Do t'ju kontaktojmë së shpejti.
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['Emri juaj *','emri','text'],['Email *','email','email']].map(([label,key,type]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>{label}</label>
                  <input type={type} required value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Mesazhi *</label>
                <textarea required rows={4} value={form.mesazhi} onChange={e => setForm({...form,mesazhi:e.target.value})}
                  placeholder="Si mund t'ju ndihmojmë?"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', background: '#f8fafc' }}
                />
              </div>
              <button type="submit" style={{ padding: 12, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', borderRadius: 10, color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4, boxShadow: '0 4px 14px rgba(79,70,229,0.3)' }}>
                Dërgo Mesazhin →
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ setActive }) {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
              <span style={{ fontWeight: 800, fontSize: 18, color: 'white' }}>ElectroStore</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#475569', maxWidth: 280, margin: 0 }}>
              Destinacioni kryesor për elektronikë cilësore në Kosovë.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Navigimi</div>
            {[['home','Home'],['products','Produktet'],['about','Rreth Nesh'],['contact','Kontakti']].map(([k,l]) => (
              <button key={k} onClick={() => setActive(k)} style={{ display: 'block', background: 'none', border: 'none', color: '#64748b', fontSize: 14, cursor: 'pointer', marginBottom: 10, padding: 0 }}>
                {l}
              </button>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Kontakti</div>
            {['📍 Prishtinë, Kosovë','📞 +383 44 000 000','✉️ info@electrostore.com'].map(i => (
              <div key={i} style={{ color: '#64748b', fontSize: 14, marginBottom: 10 }}>{i}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: 20, textAlign: 'center', fontSize: 13, color: '#334155' }}>
          © 2025 ElectroStore. Të gjitha të drejtat e rezervuara.
        </div>
      </div>
    </footer>
  );
}

export default function CustomerHome() {
  const { user, logout } = useAuth();
  const { isAdmin, isTechnician, isCashier } = useRole();
  const navigate = useNavigate();
  const isStaff = isAdmin || isTechnician || isCashier;
  const [active, setActive] = useState('home');

  const sections = {
    home: <Hero setActive={setActive} user={user} />,
    products: <ProductsSection />,
    about: <About />,
    contact: <Contact />,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: "'Inter', sans-serif" }}>
      <Navbar active={active} setActive={setActive} user={user} logout={logout} isStaff={isStaff} navigate={navigate} />
      <main>{sections[active]}</main>
      <Footer setActive={setActive} />
    </div>
  );
}