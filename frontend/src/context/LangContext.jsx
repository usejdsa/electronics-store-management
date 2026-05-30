import { createContext, useContext, useState } from 'react';

const translations = {
  sq: {
    // Nav
    home: 'Kryefaqja', products: 'Produktet', about: 'Rreth Nesh', contact: 'Kontakti',
    dashboard: 'Dashboard', logout: 'Dil', cart: 'Shporta',
    // Hero
    heroTagline: 'Teknologjia më e re, çmimi më i mirë',
    heroSub: 'Zbulo gamën tonë të gjerë të produkteve elektronike me garanci origjinale dhe shërbim profesional.',
    heroBtn1: 'Shiko Produktet', heroBtn2: 'Rreth Nesh',
    stat1: 'Produkte', stat2: 'Support', stat3: 'Garanci', stat4: 'Klientë',
    // Products
    catalogue: 'Katalogu', ourProducts: 'Produktet Tona', findProduct: 'Gjej produktin e duhur për ty',
    searchPlaceholder: 'Kërko produkt...', allCategories: 'Të gjitha kategoritë',
    priceLabel: 'Çmimi:', sortDefault: 'Rendit: Default',
    sortPriceAsc: 'Çmimi: ulët → lartë', sortPriceDesc: 'Çmimi: lartë → ulët',
    sortNameAsc: 'Emri: A → Z', sortNameDesc: 'Emri: Z → A',
    inStockOnly: 'Vetëm në stok', clearFilters: 'Pastro filtrat',
    productsFound: 'produkte të gjetura', noProducts: 'Nuk u gjetën produkte',
    inStock: 'Në stok', lowStock: 'mbetur', outOfStock: 'Pa stok',
    discount: 'ZBRITJE', addToCart: 'Shto në shportë', warranty: 'garanci',
    // Product detail
    backToProducts: '← Kthehu tek produktet', month: 'muaj',
    stockLabel: 'Gjendje', warrantyLabel: 'Garanci', brandLabel: 'Marka', modelLabel: 'Modeli',
    categoryLabel: 'Kategoria', descriptionLabel: 'Pershkrimi',
    addToCartFull: 'Shto në shportë', added: 'U shtua!', noPhoto: 'Pa foto',
    // Cart
    cartTitle: 'Shporta', continueShopping: '← Vazhdo blerjet', emptyCart: 'Shporta është bosh',
    orderNotes: 'Shënime për porosinë (opsionale)', orderBtn: 'Porosit',
    orderPlacing: 'Duke bërë porosinë...', summary: 'Përmbledhja', total: 'Totali',
    orderSuccess: 'Porosia u krye!', orderNum: 'Numri i porosisë',
    orderTotal: 'Totali', orderSuccessBtn: 'Vazhdo blerjet',
    // About
    aboutTag: 'Rreth Nesh', aboutTitle: 'Dyqani juaj i', aboutTitleHighlight: 'besueshëm',
    aboutSub: 'Që nga viti 2015, mbi 10,000 klientë të kënaqur në Kosovë.',
    teamTitle: 'Ekipi Ynë',
    val1t: 'Cilësi e Lartë', val1d: 'Vetëm produkte origjinale nga brendet botërore.',
    val2t: 'Servis Profesional', val2d: 'Ekipi teknik me mbi 10 vjet përvojë.',
    val3t: 'Dorëzim i Shpejtë', val3d: 'Dorëzim brenda 24-48 orësh.',
    val4t: 'Çmime Konkuruese', val4d: 'Çmimet më të mira në treg.',
    val5t: 'Kthim i Lehtë', val5d: 'Kthe produktin brenda 30 ditëve.',
    val6t: 'Garanci Origjinale', val6d: 'Garanci origjinale e prodhuesit.',
    // Contact
    contactTag: 'Kontakti', contactTitle: 'Na Kontaktoni', contactSub: 'Jemi këtu për t\'ju ndihmuar çdo ditë',
    adresa: 'Adresa', telefoni: 'Telefoni', email: 'Email', orari: 'Orari',
    sendMsg: 'Dërgo Mesazh', yourName: 'Emri juaj *', yourEmail: 'Email *',
    message: 'Mesazhi *', msgPlaceholder: 'Si mund t\'ju ndihmojmë?', sendBtn: 'Dërgo Mesazhin',
    msgSent: 'Mesazhi u dërgua! Do t\'ju kontaktojmë së shpejti.',
    // Footer
    footerDesc: 'Destinacioni kryesor për elektronikë cilësore në Kosovë.',
    navigation: 'Navigimi', contactFooter: 'Kontakti',
    footerRights: '© 2025 ElectroStore. Të gjitha të drejtat e rezervuara.',
  },
  en: {
    home: 'Home', products: 'Products', about: 'About Us', contact: 'Contact',
    dashboard: 'Dashboard', logout: 'Logout', cart: 'Cart',
    heroTagline: 'Latest technology, best price',
    heroSub: 'Explore our wide range of electronics with original warranty and professional service.',
    heroBtn1: 'Browse Products', heroBtn2: 'About Us',
    stat1: 'Products', stat2: 'Support', stat3: 'Warranty', stat4: 'Customers',
    catalogue: 'Catalogue', ourProducts: 'Our Products', findProduct: 'Find the right product for you',
    searchPlaceholder: 'Search products...', allCategories: 'All categories',
    priceLabel: 'Price:', sortDefault: 'Sort: Default',
    sortPriceAsc: 'Price: low → high', sortPriceDesc: 'Price: high → low',
    sortNameAsc: 'Name: A → Z', sortNameDesc: 'Name: Z → A',
    inStockOnly: 'In stock only', clearFilters: 'Clear filters',
    productsFound: 'products found', noProducts: 'No products found',
    inStock: 'In stock', lowStock: 'left', outOfStock: 'Out of stock',
    discount: 'SALE', addToCart: 'Add to cart', warranty: 'warranty',
    backToProducts: '← Back to products', month: 'months',
    stockLabel: 'Stock', warrantyLabel: 'Warranty', brandLabel: 'Brand', modelLabel: 'Model',
    categoryLabel: 'Category', descriptionLabel: 'Description',
    addToCartFull: 'Add to cart', added: 'Added!', noPhoto: 'No photo',
    cartTitle: 'Cart', continueShopping: '← Continue shopping', emptyCart: 'Your cart is empty',
    orderNotes: 'Order notes (optional)', orderBtn: 'Place order',
    orderPlacing: 'Placing order...', summary: 'Summary', total: 'Total',
    orderSuccess: 'Order placed!', orderNum: 'Order number',
    orderTotal: 'Total', orderSuccessBtn: 'Continue shopping',
    aboutTag: 'About Us', aboutTitle: 'Your', aboutTitleHighlight: 'trusted store',
    aboutSub: 'Since 2015, over 10,000 satisfied customers in Kosovo.',
    teamTitle: 'Our Team',
    val1t: 'High Quality', val1d: 'Only original products from world brands.',
    val2t: 'Professional Service', val2d: 'Technical team with 10+ years of experience.',
    val3t: 'Fast Delivery', val3d: 'Delivery within 24-48 hours.',
    val4t: 'Competitive Prices', val4d: 'Best prices on the market.',
    val5t: 'Easy Returns', val5d: 'Return the product within 30 days.',
    val6t: 'Original Warranty', val6d: 'Original manufacturer warranty.',
    contactTag: 'Contact', contactTitle: 'Get in Touch', contactSub: 'We\'re here to help every day',
    adresa: 'Address', telefoni: 'Phone', email: 'Email', orari: 'Hours',
    sendMsg: 'Send Message', yourName: 'Your name *', yourEmail: 'Email *',
    message: 'Message *', msgPlaceholder: 'How can we help you?', sendBtn: 'Send Message',
    msgSent: 'Message sent! We\'ll get back to you soon.',
    footerDesc: 'The top destination for quality electronics in Kosovo.',
    navigation: 'Navigation', contactFooter: 'Contact',
    footerRights: '© 2025 ElectroStore. All rights reserved.',
  },
};

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState('sq');
  const t = translations[lang];
  const toggleLang = () => setLang(l => l === 'sq' ? 'en' : 'sq');
  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}