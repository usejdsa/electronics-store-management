import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth }    from '../context/AuthContext';
import { useRole }    from '../hooks/useRole';
import { useCart }    from '../context/CartContext';
import { useLang }    from '../context/LangContext';
import api from '../api/axios';

import lightningIcon   from '../assets/lightning.svg';
import shieldIcon      from '../assets/shield.svg';
import wrenchIcon      from '../assets/wrench.svg';
import dollarIcon      from '../assets/dollar-sign.svg';
import shoppingBagIcon from '../assets/shopping-bag.svg';
import tagIcon         from '../assets/tag.svg';
import boxIcon         from '../assets/box.svg';
import cartIcon        from '../assets/shopping-cart.svg';
import usersIcon       from '../assets/users.svg';
import dashboardIcon   from '../assets/dashboard.svg';

// ─── Language toggle ──────────────────────────────────────────────────────────
function LangToggle() {
  const { lang, toggleLang } = useLang();
  return (
    <button
      onClick={toggleLang}
      title="Switch language"
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '5px 10px', borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.07)',
        color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 700,
        cursor: 'pointer', letterSpacing: '0.03em', flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 14 }}>{lang === 'sq' ? '🇦🇱' : '🇬🇧'}</span>
      {lang === 'sq' ? 'SQ' : 'EN'}
    </button>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ active, setActive, user, logout, isStaff, navigate }) {
  const { count } = useCart();
  const { t }     = useLang();

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(15,23,42,0.97)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={lightningIcon} alt="" style={{ width: 18, height: 18, filter: 'brightness(0) invert(1)' }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'white' }}>ElectroStore</span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 2, flex: 1, justifyContent: 'center' }}>
          {[['home', t.home], ['products', t.products], ['about', t.about], ['contact', t.contact]].map(([k, l]) => (
            <button key={k} onClick={() => setActive(k)} style={{
              padding: '7px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13,
              fontWeight: active === k ? 600 : 400,
              background: active === k ? 'rgba(255,255,255,0.13)' : 'transparent',
              color: active === k ? 'white' : 'rgba(255,255,255,0.6)',
              transition: 'all 0.15s',
            }}>{l}</button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <LangToggle />

          {isStaff && (
            <button onClick={() => navigate('/dashboard')} style={{ padding: '6px 14px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {t.dashboard}
            </button>
          )}

          {/* Cart */}
          <button onClick={() => setActive('cart')} style={{
            position: 'relative', padding: '7px 12px',
            background: active === 'cart' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <img src={cartIcon} alt={t.cart} style={{ width: 16, height: 16, filter: 'brightness(0) invert(1)' }} />
            {count > 0 && (
              <span style={{ background: '#ef4444', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>
            )}
          </button>

          {/* User + logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10 }}>
            <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>
              {user?.emri?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'white' }}>{user?.emri}</span>
          </div>
          <button onClick={logout} style={{ padding: '6px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 10, color: 'rgba(255,255,255,0.65)', fontSize: 12, cursor: 'pointer' }}>
            {t.logout}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Featured Section ────────────────────────
function FeaturedSection({ onSelectProduct, setActive }) {
  const { addToCart } = useCart();
  const { t } = useLang();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/store/products', { params: { sort: 'price_desc', limit: 4, page: 1 } })
      .then(r => setFeatured(r.data.products || []))
      .catch(console.error);
  }, []);

  const brands = [
    { name: 'Samsung',   color: '#1428A0' },
    { name: 'Sony',      color: '#000000' },
    { name: 'Apple',     color: '#555555' },
    { name: 'Logitech',  color: '#00B140' },
    { name: 'Dell',      color: '#007DB8' },
    { name: 'Lenovo',    color: '#E2231A' },
  ];

  if (featured.length === 0) return null;

  return (
    <div style={{ background: '#dddeff' }}>

      {/* Top picks */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Top Picks</div>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: 0 }}>Produktet më të shitura</h2>
          </div>
          <button onClick={() => setActive('products')} style={{ padding: '9px 20px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#4f46e5', cursor: 'pointer' }}>
            Shiko të gjitha →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {featured.map(p => (
            <div
              key={p.id}
              onClick={() => onSelectProduct(p)}
              style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 28px rgba(99,102,241,0.13)'; e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ height: 150, background: 'linear-gradient(135deg,#f0f4ff,#ede9fe)', position: 'relative', flexShrink: 0 }}>
                {p.foto_kryesore
                  ? <img src={p.foto_kryesore} alt={p.emri} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; }} />
                  : null}
                {p.cmimi_zbritjes && (
                  <div style={{ position: 'absolute', top: 10, left: 10, background: '#ef4444', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6 }}>{t.discount}</div>
                )}
              </div>
              <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{p.kategoria || 'Elektronikë'}</div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{p.emri}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>{p.marka}</div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    {p.cmimi_zbritjes
                      ? <><span style={{ fontWeight: 900, color: '#0f172a', fontSize: 16 }}>{p.cmimi_zbritjes}€</span><span style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'line-through', marginLeft: 5 }}>{p.cmimi}€</span></>
                      : <span style={{ fontWeight: 900, color: '#0f172a', fontSize: 16 }}>{p.cmimi}€</span>}
                  </div>
                  {p.sasia_stokut > 0 && (
                    <button
                      onClick={e => { e.stopPropagation(); addToCart(p); }}
                      style={{ padding: '5px 10px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none', borderRadius: 8, color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                    >
                      + {t.cart}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand strip */}
      <div style={{ borderTop: '1px solid #8e90fc', borderBottom: '1px solid #e2e8f0', background: '#dddeff', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 20 }}>Brendet që shesim</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
            {brands.map(b => (
              <div key={b.name} style={{ fontSize: 18, fontWeight: 900, color: b.color, opacity: 0.55, letterSpacing: '-0.02em', transition: 'opacity 0.2s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.55'}
              >
                {b.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ setActive, user }) {
  const { t } = useLang();
  return (
    <section style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0f1e 0%,#0f172a 35%,#1a1040 65%,#0d1225 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* Background blobs */}
      <div style={{ position: 'absolute', top: '15%', left: '8%',   width: 500, height: 500, background: 'rgba(99,102,241,0.07)',  borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, background: 'rgba(139,92,246,0.07)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, background: 'rgba(79,70,229,0.04)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

      {/* Grid lines texture */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      <div style={{ textAlign: 'center', maxWidth: 820, padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, padding: '6px 18px', marginBottom: 32, fontSize: 13, color: '#a5b4fc', fontWeight: 500 }}>
          <span style={{ width: 6, height: 6, background: '#818cf8', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          Mirësevini, {user?.emri}!
        </div>

        <h1 style={{ fontSize: 64, fontWeight: 900, color: 'white', lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em' }}>
          {t.heroTagline.split(',').map((part, i) => i === 0
            ? <span key={i}>{part},<br /></span>
            : <span key={i} style={{ background: 'linear-gradient(90deg,#818cf8,#c084fc,#e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{part}</span>
          )}
        </h1>

        <p style={{ color: '#94a3b8', fontSize: 19, maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.65 }}>
          {t.heroSub}
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 72 }}>
          <button onClick={() => setActive('products')} style={{ padding: '14px 36px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none', borderRadius: 14, color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 32px rgba(79,70,229,0.45)', letterSpacing: '0.01em' }}>
            {t.heroBtn1}
          </button>
          <button onClick={() => setActive('about')} style={{ padding: '14px 36px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 14, color: 'rgba(255,255,255,0.9)', fontSize: 16, cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
            {t.heroBtn2}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 0, justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 36 }}>
          {[['500+', t.stat1], ['24/7', t.stat2], ['2y', t.stat3], ['10k+', t.stat4]].map(([v, l], i, arr) => (
            <div key={l} style={{ textAlign: 'center', padding: '0 40px', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>{v}</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature pills */}
      <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12, zIndex: 1 }}>
        {[
          { icon: shieldIcon, text: 'Garanci Origjinale' },
          { icon: wrenchIcon, text: 'Servis 24/7' },
          { icon: tagIcon,    text: 'Çmime të Mira' },
        ].map(f => (
          <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, backdropFilter: 'blur(8px)' }}>
            <img src={f.icon} alt="" style={{ width: 13, height: 13, opacity: 0.6, filter: 'brightness(0) invert(1)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{f.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ p, onSelect, onAddToCart }) {
  const { t } = useLang();
  const [hover, setHover] = useState(false);
  const price = p.cmimi_zbritjes || p.cmimi;

  return (
    <div
      style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: `1px solid ${hover ? '#c7d2fe' : '#f1f5f9'}`, boxShadow: hover ? '0 12px 32px rgba(99,102,241,0.12)' : '0 1px 4px rgba(0,0,0,0.04)', transform: hover ? 'translateY(-2px)' : 'none', transition: 'all 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => onSelect(p)}
    >
      <div style={{ height: 160, background: 'linear-gradient(135deg,#f0f4ff,#ede9fe)', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        {p.foto_kryesore
          ? <img src={p.foto_kryesore} alt={p.emri} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
          : null}
        <div style={{ display: p.foto_kryesore ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: p.foto_kryesore ? 'absolute' : 'relative', top: 0, fontSize: 13, color: '#94a3b8' }}>{t.noPhoto}</div>
        {p.cmimi_zbritjes && <div style={{ position: 'absolute', top: 10, left: 10, background: '#ef4444', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 8 }}>{t.discount}</div>}
        <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 8, background: p.sasia_stokut > 5 ? '#dcfce7' : p.sasia_stokut > 0 ? '#fef9c3' : '#fee2e2', color: p.sasia_stokut > 5 ? '#15803d' : p.sasia_stokut > 0 ? '#a16207' : '#dc2626' }}>
          {p.sasia_stokut > 5 ? t.inStock : p.sasia_stokut > 0 ? `${p.sasia_stokut} ${t.lowStock}` : t.outOfStock}
        </div>
      </div>
      <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{p.kategoria || 'Elektronikë'}</div>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.emri}</h3>
        {(p.marka || p.modeli) && <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{p.marka} {p.modeli}</div>}
        {p.pershkrimi && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>{p.pershkrimi}</div>}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
          <div>
            {p.cmimi_zbritjes
              ? <><div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{p.cmimi_zbritjes}€</div><div style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>{p.cmimi}€</div></>
              : <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{p.cmimi}€</div>}
          </div>
          {p.garancia_muaj && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
              <img src={shieldIcon} alt="" style={{ width: 13, height: 13, opacity: 0.5 }} />{p.garancia_muaj}m
            </div>
          )}
        </div>
        {p.sasia_stokut > 0 && (
          <button onClick={e => { e.stopPropagation(); onAddToCart(p); }} style={{ marginTop: 10, width: '100%', padding: '8px 0', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none', borderRadius: 10, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <img src={cartIcon} alt="" style={{ width: 14, height: 14, filter: 'brightness(0) invert(1)' }} />{t.addToCart}
          </button>
        )}
      </div>
    </div>
  );
}


// ─── Product Reviews ─────────────────────────────────────────────────────────
function ReviewsSection({ productId }) {
  const { t } = useLang();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ vleresimi: 0, komenti: '' });
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchReviews = () => {
    api.get(`/product-reviews/product/${productId}`).then(r => setReviews(r.data)).catch(console.error);
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.vleresimi) { setError(t.reviewErrorStars); return; }
    setSubmitting(true); setError('');
    try {
      await api.post('/product-reviews', { produkti_id: productId, vleresimi: form.vleresimi, komenti: form.komenti });
      setSuccess(t.reviewSuccess);
      setForm({ vleresimi: 0, komenti: '' });
      fetchReviews();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || t.reviewError);
    } finally { setSubmitting(false); }
  };

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.vleresimi, 0) / reviews.length).toFixed(1) : null;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 48px' }}>
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>{t.reviewsTitle}</h2>
          {avg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>{avg}</span>
              <span style={{ color: '#f59e0b', fontSize: 18 }}>{'★'.repeat(Math.round(avg))}{'☆'.repeat(5 - Math.round(avg))}</span>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>({reviews.length})</span>
            </div>
          )}
        </div>

        {/* Leave a review — only for customers */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>{t.leaveReview}</h3>
          {success && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: 12, color: '#15803d', fontSize: 13 }}>{success}</div>}
          {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 12, color: '#dc2626', fontSize: 13 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            {/* Star picker */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 8 }}>{t.yourRating}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3,4,5].map(s => (
                  <span
                    key={s}
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setForm(f => ({ ...f, vleresimi: s }))}
                    style={{ fontSize: 32, cursor: 'pointer', color: s <= (hover || form.vleresimi) ? '#f59e0b' : '#e2e8f0', transition: 'color 0.1s', lineHeight: 1 }}
                  >★</span>
                ))}
              </div>
            </div>
            <textarea
              value={form.komenti}
              onChange={e => setForm(f => ({ ...f, komenti: e.target.value }))}
              placeholder={t.reviewPlaceholder}
              rows={3}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 12, background: '#f8fafc' }}
            />
            <button
              type="submit"
              disabled={submitting}
              style={{ padding: '10px 24px', background: submitting ? '#a5b4fc' : 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 600, cursor: submitting ? 'default' : 'pointer' }}
            >
              {submitting ? '...' : t.submitReview}
            </button>
          </form>
        </div>

        {/* Reviews list */}
        {reviews.length === 0
          ? <p style={{ color: '#94a3b8', fontSize: 14 }}>{t.noReviews}</p>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.map(r => (
                <div key={r.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      {r.customer_emri?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{r.customer_emri || 'Klient'}</div>
                      <div style={{ color: '#f59e0b', fontSize: 14, lineHeight: 1 }}>{'★'.repeat(r.vleresimi)}{'☆'.repeat(5 - r.vleresimi)}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8' }}>{new Date(r.data_vleresimit).toLocaleDateString()}</div>
                  </div>
                  {r.komenti && <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{r.komenti}</p>}
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}

// ─── Product Detail ───────────────────────────────────────────────────────────
function ProductDetail({ productId, onBack, onAddToCart }) {
  const { t } = useLang();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/store/products/${productId}`).then(r => setP(r.data)).catch(console.error);
  }, [productId]);

  if (!p) return <div style={{ padding: '120px 24px', textAlign: 'center', color: '#94a3b8' }}>Duke ngarkuar...</div>;

  const price = parseFloat(p.cmimi_zbritjes || p.cmimi);
  const discountPct = p.cmimi_zbritjes ? Math.round((1 - p.cmimi_zbritjes / p.cmimi) * 100) : null;

  const handleAdd = () => { onAddToCart(p, qty); setAdded(true); setTimeout(() => setAdded(false), 2000); };

  const stockColor = p.sasia_stokut > 5 ? { bg: '#dcfce7', color: '#15803d' }
    : p.sasia_stokut > 0 ? { bg: '#fef9c3', color: '#a16207' }
    : { bg: '#fee2e2', color: '#dc2626' };

  const stockLabel = p.sasia_stokut > 5 ? t.inStock
    : p.sasia_stokut > 0 ? `${t.lowStock} ${p.sasia_stokut}`
    : t.outOfStock;

  // Build info rows from all available fields — skip nulls
  const infoRows = [
    p.kategoria  && [t.categoryLabel, p.kategoria],
    p.marka      && [t.brandLabel,    p.marka],
    p.modeli     && [t.modelLabel,    p.modeli],
    [t.stockLabel, `${p.sasia_stokut ?? 0}`],
    p.garancia_muaj && [t.warrantyLabel, `${p.garancia_muaj} ${t.month}`],
  ].filter(Boolean);

  return (
    <div>
    <section style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 80 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
          {t.backToProducts}
        </button>

        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

            {/* Image */}
            <div style={{ background: 'linear-gradient(135deg,#f0f4ff,#ede9fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 380, position: 'relative', overflow: 'hidden' }}>
              {p.foto_kryesore
                ? <img src={p.foto_kryesore} alt={p.emri} style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: 380, padding: 32 }} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                : null}
              <div style={{ display: p.foto_kryesore ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 14, width: '100%', height: '100%' }}>{t.noPhoto}</div>
              {discountPct && <div style={{ position: 'absolute', top: 16, left: 16, background: '#ef4444', color: 'white', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 10 }}>-{discountPct}%</div>}
            </div>

            {/* Info */}
            <div style={{ padding: 36, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{p.kategoria || 'Elektronikë'}</div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 16px', lineHeight: 1.2 }}>{p.emri}</h1>

              {/* Price */}
              <div style={{ marginBottom: 20 }}>
                {p.cmimi_zbritjes ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontSize: 38, fontWeight: 900, color: '#0f172a' }}>{p.cmimi_zbritjes}€</span>
                    <span style={{ fontSize: 18, color: '#94a3b8', textDecoration: 'line-through' }}>{p.cmimi}€</span>
                    <span style={{ fontSize: 12, background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>-{discountPct}%</span>
                  </div>
                ) : <span style={{ fontSize: 38, fontWeight: 900, color: '#0f172a' }}>{p.cmimi}€</span>}
              </div>

              {/* Info table */}
              <div style={{ background: '#f8fafc', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: 20 }}>
                {infoRows.map(([label, val], i) => (
                  <div key={label} style={{ display: 'flex', borderBottom: i < infoRows.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                    <div style={{ width: 130, padding: '10px 14px', fontSize: 12, fontWeight: 600, color: '#64748b', background: '#f1f5f9', flexShrink: 0 }}>{label}</div>
                    <div style={{ padding: '10px 14px', fontSize: 13, color: '#0f172a', fontWeight: label === t.stockLabel ? 600 : 400 }}>
                      {label === t.stockLabel
                        ? <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: stockColor.bg, color: stockColor.color }}>{stockLabel}</span>
                        : val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {p.pershkrimi && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.descriptionLabel}</div>
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, margin: 0 }}>{p.pershkrimi}</p>
                </div>
              )}

              {/* Qty + Add to cart */}
              {p.sasia_stokut > 0 && (
                <div style={{ marginTop: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '10px 16px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700, color: '#374151' }}>−</button>
                    <span style={{ padding: '10px 18px', fontWeight: 600, fontSize: 16, minWidth: 36, textAlign: 'center' }}>{qty}</span>
                    <button onClick={() => setQty(q => Math.min(p.sasia_stokut, q + 1))} style={{ padding: '10px 16px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700, color: '#374151' }}>+</button>
                  </div>
                  <button onClick={handleAdd} style={{ flex: 1, padding: '12px 0', background: added ? '#16a34a' : 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'background 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <img src={cartIcon} alt="" style={{ width: 16, height: 16, filter: 'brightness(0) invert(1)' }} />
                    {added ? t.added : `${t.addToCartFull} · ${(price * qty).toFixed(2)}€`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    <ReviewsSection productId={productId} />
  </div>
  );
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
function Cart({ onContinueShopping }) {
  const { t } = useLang();
  const { items, removeFromCart, updateQty, clearCart, total } = useCart();
  const [placing, setPlacing] = useState(false);
  const [note, setNote] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const handleOrder = async () => {
    setPlacing(true); setError('');
    try {
      const produktet = items.map(i => ({ product_id: i.product.id, sasia: i.qty }));
      const res = await api.post('/customer/orders', { produktet, shenime: note || null });
      clearCart(); setSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gabim gjatë porosisë.');
    } finally { setPlacing(false); }
  };

  if (success) return (
    <section style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 80 }}>
      <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 30, color: '#16a34a', fontWeight: 700 }}>✓</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>{t.orderSuccess}</h2>
        <p style={{ color: '#64748b', marginBottom: 6 }}>{t.orderNum}: <strong>#{success.orderId}</strong></p>
        <p style={{ color: '#64748b', marginBottom: 32 }}>{t.orderTotal}: <strong>{parseFloat(success.totali).toFixed(2)}€</strong></p>
        <button onClick={onContinueShopping} style={{ padding: '12px 32px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>{t.orderSuccessBtn}</button>
      </div>
    </section>
  );

  return (
    <section style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 80 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: 0 }}>{t.cartTitle}</h2>
          <button onClick={onContinueShopping} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>{t.continueShopping}</button>
        </div>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
            <img src={cartIcon} alt="" style={{ width: 48, height: 48, opacity: 0.3, marginBottom: 12 }} />
            <div style={{ fontWeight: 500 }}>{t.emptyCart}</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map(({ product: p, qty }) => {
                const price = parseFloat(p.cmimi_zbritjes || p.cmimi);
                return (
                  <div key={p.id} style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 68, height: 68, borderRadius: 10, overflow: 'hidden', background: 'linear-gradient(135deg,#f0f4ff,#ede9fe)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.foto_kryesore ? <img src={p.foto_kryesore} alt={p.emri} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} /> : <span style={{ fontSize: 11, color: '#94a3b8' }}>{t.noPhoto}</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.emri}</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>{p.marka} {p.modeli}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#4f46e5', marginTop: 2 }}>{price.toFixed(2)}€</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                      <button onClick={() => updateQty(p.id, qty - 1)} style={{ padding: '6px 12px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontWeight: 700 }}>−</button>
                      <span style={{ padding: '6px 12px', fontWeight: 600 }}>{qty}</span>
                      <button onClick={() => updateQty(p.id, Math.min(p.sasia_stokut, qty + 1))} style={{ padding: '6px 12px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+</button>
                    </div>
                    <div style={{ fontWeight: 700, color: '#0f172a', minWidth: 68, textAlign: 'right' }}>{(price * qty).toFixed(2)}€</div>
                    <button onClick={() => removeFromCart(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 20, padding: '0 4px', lineHeight: 1 }}>×</button>
                  </div>
                );
              })}
            </div>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, position: 'sticky', top: 88 }}>
              <h3 style={{ margin: '0 0 18px', fontWeight: 800, color: '#0f172a', fontSize: 17 }}>{t.summary}</h3>
              {items.map(({ product: p, qty }) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b', marginBottom: 8 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '62%' }}>{p.emri} × {qty}</span>
                  <span>{(parseFloat(p.cmimi_zbritjes || p.cmimi) * qty).toFixed(2)}€</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #e2e8f0', margin: '14px 0', paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 20, color: '#0f172a' }}>
                <span>{t.total}</span><span>{total.toFixed(2)}€</span>
              </div>
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder={t.orderNotes} rows={3} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
              {error && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 12, background: '#fef2f2', padding: '8px 12px', borderRadius: 8 }}>{error}</div>}
              <button onClick={handleOrder} disabled={placing} style={{ width: '100%', padding: 14, background: placing ? '#a5b4fc' : 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 700, cursor: placing ? 'default' : 'pointer' }}>
                {placing ? t.orderPlacing : `${t.orderBtn} · ${total.toFixed(2)}€`}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Products Section ─────────────────────────────────────────────────────────
function ProductsSection({ onSelectProduct }) {
  const { addToCart } = useCart();
  const { t } = useLang();
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 9999 });
  const [filters, setFilters]       = useState({ kategoria_id: '', search: '', min_cmimi: '', max_cmimi: '', sort: '', inStock: false });
  const [page, setPage]   = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const LIMIT = 12;

  useEffect(() => {
    api.get('/store/categories').then(r => setCategories(r.data)).catch(console.error);
    api.get('/store/price-range').then(r => setPriceRange(r.data)).catch(console.error);
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (filters.kategoria_id) params.kategoria_id = filters.kategoria_id;
    if (filters.search)       params.search = filters.search;
    if (filters.min_cmimi)    params.min_cmimi = filters.min_cmimi;
    if (filters.max_cmimi)    params.max_cmimi = filters.max_cmimi;
    if (filters.sort)         params.sort = filters.sort;
    api.get('/store/products', { params })
      .then(r => { setProducts(r.data.products); setPages(r.data.pages); setTotal(r.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setF = (key, val) => { setFilters(f => ({ ...f, [key]: val })); setPage(1); };
  const clearFilters = () => { setFilters({ kategoria_id: '', search: '', min_cmimi: '', max_cmimi: '', sort: '', inStock: false }); setPage(1); };
  const hasFilters = filters.kategoria_id || filters.search || filters.min_cmimi || filters.max_cmimi || filters.sort || filters.inStock;
  const displayed = filters.inStock ? products.filter(p => p.sasia_stokut > 0) : products;

  return (
    <section style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', paddingTop: 88, paddingBottom: 28, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{t.catalogue}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>{t.ourProducts}</h2>
              {!loading && <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>{total} {t.productsFound}</p>}
            </div>
            {hasFilters && <button onClick={clearFilters} style={{ padding: '8px 16px', background: 'white', border: '1px solid #fecaca', borderRadius: 10, fontSize: 13, cursor: 'pointer', color: '#ef4444', fontWeight: 600 }}>{t.clearFilters}</button>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '18px 20px', marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input placeholder={t.searchPlaceholder} value={filters.search} onChange={e => setF('search', e.target.value)} style={{ flex: '1 1 180px', padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none' }} />
            <select value={filters.kategoria_id} onChange={e => setF('kategoria_id', e.target.value)} style={{ flex: '1 1 160px', padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', background: 'white', cursor: 'pointer' }}>
              <option value="">{t.allCategories}</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.emertimi} ({c.numri_produkteve})</option>)}
            </select>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 200px' }}>
              <span style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{t.priceLabel}</span>
              <input type="number" placeholder={String(priceRange.min)} value={filters.min_cmimi} onChange={e => setF('min_cmimi', e.target.value)} style={{ width: 80, padding: '9px 10px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none' }} />
              <span style={{ color: '#94a3b8' }}>—</span>
              <input type="number" placeholder={String(priceRange.max)} value={filters.max_cmimi} onChange={e => setF('max_cmimi', e.target.value)} style={{ width: 80, padding: '9px 10px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none' }} />
              <span style={{ fontSize: 13, color: '#64748b' }}>€</span>
            </div>
            <select value={filters.sort} onChange={e => setF('sort', e.target.value)} style={{ flex: '1 1 160px', padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', background: 'white', cursor: 'pointer' }}>
              <option value="">{t.sortDefault}</option>
              <option value="price_asc">{t.sortPriceAsc}</option>
              <option value="price_desc">{t.sortPriceDesc}</option>
              <option value="name_asc">{t.sortNameAsc}</option>
              <option value="name_desc">{t.sortNameDesc}</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#374151', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <input type="checkbox" checked={filters.inStock} onChange={e => setF('inStock', e.target.checked)} style={{ width: 15, height: 15 }} />{t.inStockOnly}
            </label>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
            {[...Array(8)].map((_,i) => <div key={i} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid #f1f5f9' }}><div style={{ height: 160, background: '#f1f5f9' }} /><div style={{ padding: 16 }}><div style={{ height: 10, background: '#f1f5f9', borderRadius: 6, marginBottom: 8, width: '40%' }} /><div style={{ height: 14, background: '#f1f5f9', borderRadius: 6, marginBottom: 6, width: '80%' }} /></div></div>)}
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
            <img src={boxIcon} alt="" style={{ width: 48, height: 48, marginBottom: 12, opacity: 0.35 }} />
            <div style={{ fontWeight: 500 }}>{t.noProducts}</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
            {displayed.map(p => <ProductCard key={p.id} p={p} onSelect={onSelectProduct} onAddToCart={q => addToCart(q)} />)}
          </div>
        )}

        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: 10, background: 'white', cursor: page === 1 ? 'default' : 'pointer', color: page === 1 ? '#94a3b8' : '#374151', fontWeight: 600 }}>←</button>
            {[...Array(pages)].map((_,i) => <button key={i} onClick={() => setPage(i+1)} style={{ padding: '8px 14px', border: '1px solid', borderRadius: 10, fontWeight: 600, cursor: 'pointer', background: page === i+1 ? '#4f46e5' : 'white', color: page === i+1 ? 'white' : '#374151', borderColor: page === i+1 ? '#4f46e5' : '#e2e8f0' }}>{i+1}</button>)}
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: 10, background: 'white', cursor: page === pages ? 'default' : 'pointer', color: page === pages ? '#94a3b8' : '#374151', fontWeight: 600 }}>→</button>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  const { t } = useLang();
  const values = [
    { icon: shieldIcon,      title: t.val1t, desc: t.val1d },
    { icon: wrenchIcon,      title: t.val2t, desc: t.val2d },
    { icon: shoppingBagIcon, title: t.val3t, desc: t.val3d },
    { icon: dollarIcon,      title: t.val4t, desc: t.val4d },
    { icon: tagIcon,         title: t.val5t, desc: t.val5d },
    { icon: shieldIcon,      title: t.val6t, desc: t.val6d },
  ];
  const team = [
    { name: 'Usejd Salihu', role: 'Themelues',    initials: 'US', color: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
    { name: 'Auron Hajrullahu',    role: 'Themelues',  initials: 'AH', color: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
    { name: 'Shpat Shala', role: 'Themelues', initials: 'SS', color: 'linear-gradient(135deg,#06b6d4,#0284c7)' },
  ];
  return (
    <section style={{ minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', padding: '88px 24px 60px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{t.aboutTag}</div>
        <h2 style={{ fontSize: 48, fontWeight: 900, color: 'white', marginBottom: 16 }}>{t.aboutTitle} <span style={{ background: 'linear-gradient(90deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t.aboutTitleHighlight}</span></h2>
        <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 560, margin: '0 auto' }}>{t.aboutSub}</p>
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 56 }}>
          {values.map(v => (
            <div key={v.title} style={{ padding: 24, background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#c7d2fe'; e.currentTarget.style.boxShadow='0 8px 24px rgba(99,102,241,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.boxShadow='none'; }}
            >
              <div style={{ width: 40, height: 40, background: '#eef2ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <img src={v.icon} alt="" style={{ width: 22, height: 22, opacity: 0.75 }} />
              </div>
              <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 6, fontSize: 16 }}>{v.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginBottom: 28 }}><h3 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a' }}>{t.teamTitle}</h3></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 680, margin: '0 auto' }}>
          {team.map(tm => (
            <div key={tm.name} style={{ textAlign: 'center', padding: 24, background: 'white', border: '1px solid #e2e8f0', borderRadius: 16 }}>
              <div style={{ width: 72, height: 72, background: tm.color, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: 'white', margin: '0 auto 12px' }}>{tm.initials}</div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>{tm.name}</div>
              <div style={{ color: '#6366f1', fontSize: 13, marginTop: 4 }}>{tm.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({ emri: '', email: '', mesazhi: '' });
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setSent(true); setForm({ emri:'', email:'', mesazhi:'' }); setTimeout(() => setSent(false), 4000); };
  const infoCards = [
    { key: t.adresa,   val: 'Rruga Prishtina, Nr. 15\nPrishtinë, Kosovë', bg: '#eff6ff', border: '#bfdbfe' },
    { key: t.telefoni, val: '+383 44 000 000\n+383 38 000 000',             bg: '#f0fdf4', border: '#bbf7d0' },
    { key: t.email,    val: 'info@electrostore.com\nsupport@electrostore.com', bg: '#faf5ff', border: '#e9d5ff' },
    { key: t.orari,    val: 'E Hënë – E Premte: 08:00 – 20:00\nE Shtunë: 09:00 – 16:00', bg: '#fffbeb', border: '#fde68a' },
  ];
  return (
    <section style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', padding: '88px 24px 60px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{t.contactTag}</div>
        <h2 style={{ fontSize: 48, fontWeight: 900, color: 'white', marginBottom: 12 }}>{t.contactTitle}</h2>
        <p style={{ color: '#94a3b8', fontSize: 18 }}>{t.contactSub}</p>
      </div>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {infoCards.map(c => (
              <div key={c.key} style={{ padding: '16px 20px', background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{c.key}</div>
                <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{c.val}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 24, marginTop: 0 }}>{t.sendMsg}</h3>
            {sent && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#15803d', fontSize: 14 }}>{t.msgSent}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[[t.yourName,'emri','text'],[t.yourEmail,'email','email']].map(([label,key,type]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>{label}</label>
                  <input type={type} required value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>{t.message}</label>
                <textarea required rows={4} value={form.mesazhi} onChange={e => setForm({...form,mesazhi:e.target.value})} placeholder={t.msgPlaceholder} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', background: '#f8fafc' }} />
              </div>
              <button type="submit" style={{ padding: 12, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none', borderRadius: 10, color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>{t.sendBtn}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setActive }) {
  const { t } = useLang();
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={lightningIcon} alt="" style={{ width: 16, height: 16, filter: 'brightness(0) invert(1)' }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 18, color: 'white' }}>ElectroStore</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#475569', maxWidth: 280, margin: 0 }}>{t.footerDesc}</p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>{t.navigation}</div>
            {[['home', t.home],['products', t.products],['about', t.about],['contact', t.contact]].map(([k, l]) => (
              <button key={k} onClick={() => setActive(k)} style={{ display: 'block', background: 'none', border: 'none', color: '#64748b', fontSize: 14, cursor: 'pointer', marginBottom: 10, padding: 0 }}>{l}</button>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>{t.contactFooter}</div>
            {['Prishtinë, Kosovë', '+383 44 000 000', 'info@electrostore.com'].map(i => (
              <div key={i} style={{ color: '#64748b', fontSize: 14, marginBottom: 10 }}>{i}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: 20, textAlign: 'center', fontSize: 13, color: '#334155' }}>{t.footerRights}</div>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function CustomerHome() {
  const { user, logout }             = useAuth();
  const { isAdmin, isTechnician, isCashier } = useRole();
  const { addToCart }                = useCart();
  const navigate                     = useNavigate();
  const isStaff = isAdmin || isTechnician || isCashier;

  const [active, setActive]                     = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleSelectProduct = (p) => { setSelectedProductId(p.id); setActive('product'); };
  const handleBackToProducts = ()  => { setSelectedProductId(null); setActive('products'); };

  const sections = {
    home: (
      <>
        <Hero setActive={setActive} user={user} />
        <FeaturedSection onSelectProduct={handleSelectProduct} setActive={setActive} />
      </>
    ),
    products: <ProductsSection onSelectProduct={handleSelectProduct} />,
    product:  selectedProductId ? <ProductDetail productId={selectedProductId} onBack={handleBackToProducts} onAddToCart={(p, qty) => addToCart(p, qty)} /> : null,
    about:    <About />,
    contact:  <Contact />,
    cart:     <Cart onContinueShopping={() => setActive('products')} />,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar active={active} setActive={setActive} user={user} logout={logout} isStaff={isStaff} navigate={navigate} />
      <main>{sections[active]}</main>
      {active !== 'cart' && <Footer setActive={setActive} />}
    </div>
  );
}