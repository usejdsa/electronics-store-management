import { createContext, useContext, useState } from 'react';

const translations = {
  sq: {
    // ── Nav / Sidebar ─────────────────────────────────────────
    home: 'Kryefaqja', products: 'Produktet', about: 'Rreth Nesh', contact: 'Kontakti',
    dashboard: 'Dashboard', logout: 'Dil', cart: 'Shporta',
    categories: 'Kategoritë', customers: 'Klientët', orders: 'Porositë',
    orderDetails: 'Detajet e Porosive', suppliers: 'Furnitorët',
    purchaseOrders: 'Porosi Blerje', inventory: 'Inventari',
    userManagement: 'Menaxhimi i Përdoruesve', customerView: 'Pamja e Klientit',
    loggedInAs: 'Hyrë si', signOut: 'Dil',

    // ── Hero ──────────────────────────────────────────────────
    heroTagline: 'Teknologjia më e re, çmimi më i mirë',
    heroSub: 'Zbulo gamën tonë të gjerë të produkteve elektronike me garanci origjinale dhe shërbim profesional.',
    heroBtn1: 'Shiko Produktet', heroBtn2: 'Rreth Nesh',
    stat1: 'Produkte', stat2: 'Support', stat3: 'Garanci', stat4: 'Klientë',

    // ── Products (customer) ───────────────────────────────────
    catalogue: 'Katalogu', ourProducts: 'Produktet Tona', findProduct: 'Gjej produktin e duhur për ty',
    searchPlaceholder: 'Kërko produkt...', allCategories: 'Të gjitha kategoritë',
    priceLabel: 'Çmimi:', sortDefault: 'Rendit: Default',
    sortPriceAsc: 'Çmimi: ulët → lartë', sortPriceDesc: 'Çmimi: lartë → ulët',
    sortNameAsc: 'Emri: A → Z', sortNameDesc: 'Emri: Z → A',
    inStockOnly: 'Vetëm në stok', clearFilters: 'Pastro filtrat',
    productsFound: 'produkte të gjetura', noProducts: 'Nuk u gjetën produkte',
    inStock: 'Në stok', lowStock: 'mbetur', outOfStock: 'Pa stok',
    discount: 'ZBRITJE', addToCart: 'Shto në shportë', warranty: 'garanci',

    // ── Product detail ────────────────────────────────────────
    backToProducts: '← Kthehu tek produktet', month: 'muaj',
    stockLabel: 'Gjendje', warrantyLabel: 'Garanci', brandLabel: 'Marka', modelLabel: 'Modeli',
    categoryLabel: 'Kategoria', descriptionLabel: 'Pershkrimi',
    addToCartFull: 'Shto në shportë', added: 'U shtua!', noPhoto: 'Pa foto',

    // ── Cart ──────────────────────────────────────────────────
    cartTitle: 'Shporta', continueShopping: '← Vazhdo blerjet', emptyCart: 'Shporta është bosh',
    orderNotes: 'Shënime për porosinë (opsionale)', orderBtn: 'Porosit',
    orderPlacing: 'Duke bërë porosinë...', summary: 'Përmbledhja', total: 'Totali',
    orderSuccess: 'Porosia u krye!', orderNum: 'Numri i porosisë',
    orderTotal: 'Totali', orderSuccessBtn: 'Vazhdo blerjet',

    // ── About ─────────────────────────────────────────────────
    aboutTag: 'Rreth Nesh', aboutTitle: 'Dyqani juaj i', aboutTitleHighlight: 'besueshëm',
    aboutSub: 'Që nga viti 2015, mbi 10,000 klientë të kënaqur në Kosovë.',
    teamTitle: 'Ekipi Ynë',
    val1t: 'Cilësi e Lartë', val1d: 'Vetëm produkte origjinale nga brendet botërore.',
    val2t: 'Servis Profesional', val2d: 'Ekipi teknik me mbi 10 vjet përvojë.',
    val3t: 'Dorëzim i Shpejtë', val3d: 'Dorëzim brenda 24-48 orësh.',
    val4t: 'Çmime Konkuruese', val4d: 'Çmimet më të mira në treg.',
    val5t: 'Kthim i Lehtë', val5d: 'Kthe produktin brenda 30 ditëve.',
    val6t: 'Garanci Origjinale', val6d: 'Garanci origjinale e prodhuesit.',

    // ── Contact ───────────────────────────────────────────────
    contactTag: 'Kontakti', contactTitle: 'Na Kontaktoni', contactSub: 'Jemi këtu për t\'ju ndihmuar çdo ditë',
    adresa: 'Adresa', telefoni: 'Telefoni', email: 'Email', orari: 'Orari',
    sendMsg: 'Dërgo Mesazh', yourName: 'Emri juaj *', yourEmail: 'Email *',
    message: 'Mesazhi *', msgPlaceholder: 'Si mund t\'ju ndihmojmë?', sendBtn: 'Dërgo Mesazhin',
    msgSent: 'Mesazhi u dërgua! Do t\'ju kontaktojmë së shpejti.',

    // ── Footer ────────────────────────────────────────────────
    footerDesc: 'Destinacioni kryesor për elektronikë cilësore në Kosovë.',
    navigation: 'Navigimi', contactFooter: 'Kontakti',
    footerRights: '© 2025 ElectroStore. Të gjitha të drejtat e rezervuara.',

    // ── Dashboard (admin) ─────────────────────────────────────
    dashboardTitle: 'Dashboard',
    dashboardSub: 'Pasqyra e sistemit',
    loading: 'Duke ngarkuar...',
    loadError: 'Gabim gjatë ngarkimit të të dhënave.',
    noData: 'Nuk ka të dhëna',
    noOrders: 'Nuk ka porosi',
    stat_products: 'Produktet', stat_productsSub: 'produkte aktive',
    stat_customers: 'Klientët', stat_customersSub: 'të regjistruar',
    stat_orders: 'Porositë', stat_ordersSub: 'gjithsej',
    stat_suppliers: 'Furnitorët', stat_suppliersSub: 'partnerë',
    stat_revenue: 'Të Ardhurat', stat_revenueSub: 'porosi të konfirmuara',
    stat_lowStock: 'Stok i Ulët', stat_lowStockSub: 'produkte nën 5 copë',
    stat_warranties: 'Garanci Aktive', stat_warrantiesSub: 'në fuqi',
    stat_services: 'Servise Hapur', stat_servicesSub: 'kërkesa të hapura',
    chartRevenue: 'Të Ardhurat — 6 Muajt e Fundit',
    chartOrderStatus: 'Statusi Porosive',
    recentOrders: 'Porositë e Fundit',
    topProducts: 'Top 5 Produktet',
    colId: 'ID', colClient: 'Klienti', colTotal: 'Totali',
    colStatus: 'Statusi', colDate: 'Data',
    unitsSold: 'copë të shitura',

    // ── Admin common ──────────────────────────────────────────
    add: 'Shto', edit: 'Ndrysho', delete: 'Fshi', save: 'Ruaj', cancel: 'Anulo',
    actions: 'Veprimet', search: 'Kërko', confirmDelete: 'Fshi këtë rekord?',
    noRecords: 'Nuk ka rekorde',
    name: 'Emri', description: 'Pershkrimi', category: 'Kategoria',
    price: 'Çmimi', stock: 'Stoku', brand: 'Marka', model: 'Modeli',
    warranty: 'Garanci', photo: 'Foto',

    // ── Products admin ────────────────────────────────────────
    productsTitle: 'Produktet', productsCount: 'produkte gjithsej',
    addProduct: '+ Shto Produkt', editProduct: 'Ndrysho Produktin', newProduct: 'Shto Produkt të Ri',
    searchProduct: 'Kërko produkt...', noCategory: 'Pa kategori',
    productName: 'Emri *', productPrice: 'Çmimi (€) *', productDiscount: 'Çmimi me Zbritje (€)',
    productStock: 'Sasia në Stok', productWarranty: 'Garancia (muaj)',
    productDesc: 'Përshkrimi', productPhoto: 'Foto e Produktit',
    photoHint: 'Kliko ose zvarrit foto këtu',
    saveChanges: 'Ruaj Ndryshimet', discount_label: 'zbritje', pieces: 'copë',
    colPhoto: '', colName: 'Emri', colCategory: 'Kategoria',
    colPrice: 'Çmimi', colStock: 'Stoku', colWarranty: 'Garancia',

    // ── Categories admin ──────────────────────────────────────
    categoriesTitle: 'Kategoritë', categoriesCount: 'kategori gjithsej',
    addCategory: '+ Shto Kategori', editCategory: 'Ndrysho Kategorinë', newCategory: 'Shto Kategori të Re',
    parentCategory: 'Kategoria Prindëre', noParent: 'Pa prind',
    iconEmoji: 'Ikona (emoji)',
    colCategoryName: 'Emri', colParent: 'Prindi', colProducts: 'Produktet', colIcon: 'Ikona',

    // ── Customers admin ───────────────────────────────────────
    customersTitle: 'Klientët', customersCount: 'klientë gjithsej',
    addCustomer: '+ Shto Klient', editCustomer: 'Ndrysho Klientin', newCustomer: 'Shto Klient të Ri',
    searchCustomer: 'Kërko klient...',
    firstName: 'Emri', lastName: 'Mbiemri', phone: 'Telefoni',
    address: 'Adresa', city: 'Qyteti',
    colFirstName: 'Emri', colLastName: 'Mbiemri',
    colEmail: 'Email', colPhone: 'Telefoni', colCity: 'Qyteti',

    // ── Orders admin ──────────────────────────────────────────
    ordersTitle: 'Porositë', ordersCount: 'porosi gjithsej',
    addOrder: '+ Shto Porosi', editOrder: 'Ndrysho Porosinë', newOrder: 'Shto Porosi të Re',
    filterStatus: 'Filtro sipas statusit', allStatuses: 'Të gjitha',
    selectCustomer: '— Zgjedh Klientin —',
    notes: 'Shënime', totalAmount: 'Totali (€)',
    colOrder: 'Porosi', colSource: 'Burimi', colNotes: 'Shënime',
    confirmDeleteOrder: 'Fshi këtë porosi?',

    // ── Suppliers admin ───────────────────────────────────────
    suppliersTitle: 'Furnitorët', suppliersCount: 'furnitorë gjithsej',
    addSupplier: '+ Shto Furnitor', editSupplier: 'Ndrysho Furnitorin', newSupplier: 'Shto Furnitor të Ri',
    searchSupplier: 'Kërko furnitor...',
    companyName: 'Emri i Kompanisë', contactPerson: 'Personi i Kontaktit',
    colCompany: 'Kompania', colContact: 'Kontakti',
    confirmDeleteSupplier: 'Fshi këtë furnitor?',

    // ── Purchase Orders admin ─────────────────────────────────
    purchaseOrdersTitle: 'Porosi Blerje',
    addPurchaseOrder: '+ Shto Porosi Blerje',
    editPurchaseOrder: 'Ndrysho Porosinë e Blerjes',
    newPurchaseOrder: 'Shto Porosi Blerje të Re',
    selectSupplier: '— Zgjedh Furnitorin —',
    selectProduct: '— Zgjedh Produktin —',
    quantity: 'Sasia', unitCost: 'Çmimi Blerjes (€/copë)',
    orderDate: 'Data e Porosisë', arrivalDate: 'Data e Arritjes',
    colSupplier: 'Furnitori', colProduct: 'Produkti',
    colQty: 'Sasia', colUnitCost: 'Çmimi/copë', colTotalCost: 'Totali',
    confirmDeletePO: 'Fshi këtë porosi blerje?',

    // ── Inventory admin ───────────────────────────────────────
    inventoryTitle: 'Inventari', inventoryCount: 'lëvizje gjithsej',
    addInventory: '+ Shto Lëvizje', newInventory: 'Shto Lëvizje Inventari',
    movementType: 'Lloji i Lëvizjes',
    typeIn: 'Hyrje', typeOut: 'Dalje', typeAdjust: 'Rregullim',
    refType: 'Lloji i Referencës', refId: 'ID Referenca',
    inventoryNotes: 'Shënime',
    colType: 'Lloji', colQty: 'Sasia', colRefType: 'Referenca', colUser: 'Përdoruesi',

    // ── Order Details admin ───────────────────────────────────
    orderDetailsTitle: 'Detajet e Porosive',
    addOrderDetail: '+ Shto Detaj',
    editOrderDetail: 'Ndrysho Detajin', newOrderDetail: 'Shto Detaj Porosie',
    orderId: 'Porosi ID', unitPrice: 'Çmimi Njësi (€)', discountLabel: 'Zbritja (€)',
    colOrder: 'Porosi', colProduct: 'Produkti',
    colUnitPrice: 'Çmimi Njësi', colDiscount: 'Zbritja',
    confirmDeleteDetail: 'Fshi këtë detaj?',

    // ── User Management ───────────────────────────────────────
    usersTitle: 'Menaxhimi i Përdoruesve',
    colUser: 'Përdoruesi', colRoles: 'Rolet', colStatus: 'Statusi',
    active: 'Aktiv', inactive: 'Joaktiv',
    editRoles: 'Ndrysho Rolet', saveRoles: 'Ruaj Rolet',
  },

  en: {
    // ── Nav / Sidebar ─────────────────────────────────────────
    home: 'Home', products: 'Products', about: 'About Us', contact: 'Contact',
    dashboard: 'Dashboard', logout: 'Logout', cart: 'Cart',
    categories: 'Categories', customers: 'Customers', orders: 'Orders',
    orderDetails: 'Order Details', suppliers: 'Suppliers',
    purchaseOrders: 'Purchase Orders', inventory: 'Inventory',
    userManagement: 'User Management', customerView: 'Customer View',
    loggedInAs: 'Logged in as', signOut: 'Sign out',

    // ── Hero ──────────────────────────────────────────────────
    heroTagline: 'Latest technology, best price',
    heroSub: 'Explore our wide range of electronics with original warranty and professional service.',
    heroBtn1: 'Browse Products', heroBtn2: 'About Us',
    stat1: 'Products', stat2: 'Support', stat3: 'Warranty', stat4: 'Customers',

    // ── Products (customer) ───────────────────────────────────
    catalogue: 'Catalogue', ourProducts: 'Our Products', findProduct: 'Find the right product for you',
    searchPlaceholder: 'Search products...', allCategories: 'All categories',
    priceLabel: 'Price:', sortDefault: 'Sort: Default',
    sortPriceAsc: 'Price: low → high', sortPriceDesc: 'Price: high → low',
    sortNameAsc: 'Name: A → Z', sortNameDesc: 'Name: Z → A',
    inStockOnly: 'In stock only', clearFilters: 'Clear filters',
    productsFound: 'products found', noProducts: 'No products found',
    inStock: 'In stock', lowStock: 'left', outOfStock: 'Out of stock',
    discount: 'SALE', addToCart: 'Add to cart', warranty: 'warranty',

    // ── Product detail ────────────────────────────────────────
    backToProducts: '← Back to products', month: 'months',
    stockLabel: 'Stock', warrantyLabel: 'Warranty', brandLabel: 'Brand', modelLabel: 'Model',
    categoryLabel: 'Category', descriptionLabel: 'Description',
    addToCartFull: 'Add to cart', added: 'Added!', noPhoto: 'No photo',

    // ── Cart ──────────────────────────────────────────────────
    cartTitle: 'Cart', continueShopping: '← Continue shopping', emptyCart: 'Your cart is empty',
    orderNotes: 'Order notes (optional)', orderBtn: 'Place order',
    orderPlacing: 'Placing order...', summary: 'Summary', total: 'Total',
    orderSuccess: 'Order placed!', orderNum: 'Order number',
    orderTotal: 'Total', orderSuccessBtn: 'Continue shopping',

    // ── About ─────────────────────────────────────────────────
    aboutTag: 'About Us', aboutTitle: 'Your', aboutTitleHighlight: 'trusted store',
    aboutSub: 'Since 2015, over 10,000 satisfied customers in Kosovo.',
    teamTitle: 'Our Team',
    val1t: 'High Quality', val1d: 'Only original products from world brands.',
    val2t: 'Professional Service', val2d: 'Technical team with 10+ years of experience.',
    val3t: 'Fast Delivery', val3d: 'Delivery within 24-48 hours.',
    val4t: 'Competitive Prices', val4d: 'Best prices on the market.',
    val5t: 'Easy Returns', val5d: 'Return the product within 30 days.',
    val6t: 'Original Warranty', val6d: 'Original manufacturer warranty.',

    // ── Contact ───────────────────────────────────────────────
    contactTag: 'Contact', contactTitle: 'Get in Touch', contactSub: 'We\'re here to help every day',
    adresa: 'Address', telefoni: 'Phone', email: 'Email', orari: 'Hours',
    sendMsg: 'Send Message', yourName: 'Your name *', yourEmail: 'Email *',
    message: 'Message *', msgPlaceholder: 'How can we help you?', sendBtn: 'Send Message',
    msgSent: 'Message sent! We\'ll get back to you soon.',

    // ── Footer ────────────────────────────────────────────────
    footerDesc: 'The top destination for quality electronics in Kosovo.',
    navigation: 'Navigation', contactFooter: 'Contact',
    footerRights: '© 2025 ElectroStore. All rights reserved.',

    // ── Dashboard (admin) ─────────────────────────────────────
    dashboardTitle: 'Dashboard',
    dashboardSub: 'System overview',
    loading: 'Loading...',
    loadError: 'Error loading data.',
    noData: 'No data available',
    noOrders: 'No orders',
    stat_products: 'Products', stat_productsSub: 'active products',
    stat_customers: 'Customers', stat_customersSub: 'registered',
    stat_orders: 'Orders', stat_ordersSub: 'total',
    stat_suppliers: 'Suppliers', stat_suppliersSub: 'partners',
    stat_revenue: 'Revenue', stat_revenueSub: 'confirmed orders',
    stat_lowStock: 'Low Stock', stat_lowStockSub: 'products under 5 units',
    stat_warranties: 'Active Warranties', stat_warrantiesSub: 'in effect',
    stat_services: 'Open Services', stat_servicesSub: 'open requests',
    chartRevenue: 'Revenue — Last 6 Months',
    chartOrderStatus: 'Order Status',
    recentOrders: 'Recent Orders',
    topProducts: 'Top 5 Products',
    colId: 'ID', colClient: 'Customer', colTotal: 'Total',
    colStatus: 'Status', colDate: 'Date',
    unitsSold: 'units sold',

    // ── Admin common ──────────────────────────────────────────
    add: 'Add', edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel',
    actions: 'Actions', search: 'Search', confirmDelete: 'Delete this record?',
    noRecords: 'No records found',
    name: 'Name', description: 'Description', category: 'Category',
    price: 'Price', stock: 'Stock', brand: 'Brand', model: 'Model',
    warranty: 'Warranty', photo: 'Photo',

    // ── Products admin ────────────────────────────────────────
    productsTitle: 'Products', productsCount: 'products total',
    addProduct: '+ Add Product', editProduct: 'Edit Product', newProduct: 'Add New Product',
    searchProduct: 'Search product...', noCategory: 'No category',
    productName: 'Name *', productPrice: 'Price (€) *', productDiscount: 'Discount Price (€)',
    productStock: 'Stock Quantity', productWarranty: 'Warranty (months)',
    productDesc: 'Description', productPhoto: 'Product Photo',
    photoHint: 'Click or drag photo here',
    saveChanges: 'Save Changes', discount_label: 'sale', pieces: 'units',
    colPhoto: '', colName: 'Name', colCategory: 'Category',
    colPrice: 'Price', colStock: 'Stock', colWarranty: 'Warranty',

    // ── Categories admin ──────────────────────────────────────
    categoriesTitle: 'Categories', categoriesCount: 'categories total',
    addCategory: '+ Add Category', editCategory: 'Edit Category', newCategory: 'Add New Category',
    parentCategory: 'Parent Category', noParent: 'No parent',
    iconEmoji: 'Icon (emoji)',
    colCategoryName: 'Name', colParent: 'Parent', colProducts: 'Products', colIcon: 'Icon',

    // ── Customers admin ───────────────────────────────────────
    customersTitle: 'Customers', customersCount: 'customers total',
    addCustomer: '+ Add Customer', editCustomer: 'Edit Customer', newCustomer: 'Add New Customer',
    searchCustomer: 'Search customer...',
    firstName: 'First Name', lastName: 'Last Name', phone: 'Phone',
    address: 'Address', city: 'City',
    colFirstName: 'First Name', colLastName: 'Last Name',
    colEmail: 'Email', colPhone: 'Phone', colCity: 'City',

    // ── Orders admin ──────────────────────────────────────────
    ordersTitle: 'Orders', ordersCount: 'orders total',
    addOrder: '+ Add Order', editOrder: 'Edit Order', newOrder: 'Add New Order',
    filterStatus: 'Filter by status', allStatuses: 'All statuses',
    selectCustomer: '— Select Customer —',
    notes: 'Notes', totalAmount: 'Total (€)',
    colOrder: 'Order', colSource: 'Source', colNotes: 'Notes',
    confirmDeleteOrder: 'Delete this order?',

    // ── Suppliers admin ───────────────────────────────────────
    suppliersTitle: 'Suppliers', suppliersCount: 'suppliers total',
    addSupplier: '+ Add Supplier', editSupplier: 'Edit Supplier', newSupplier: 'Add New Supplier',
    searchSupplier: 'Search supplier...',
    companyName: 'Company Name', contactPerson: 'Contact Person',
    colCompany: 'Company', colContact: 'Contact',
    confirmDeleteSupplier: 'Delete this supplier?',

    // ── Purchase Orders admin ─────────────────────────────────
    purchaseOrdersTitle: 'Purchase Orders',
    addPurchaseOrder: '+ Add Purchase Order',
    editPurchaseOrder: 'Edit Purchase Order',
    newPurchaseOrder: 'Add New Purchase Order',
    selectSupplier: '— Select Supplier —',
    selectProduct: '— Select Product —',
    quantity: 'Quantity', unitCost: 'Purchase Price (€/unit)',
    orderDate: 'Order Date', arrivalDate: 'Arrival Date',
    colSupplier: 'Supplier', colProduct: 'Product',
    colQty: 'Qty', colUnitCost: 'Unit Cost', colTotalCost: 'Total',
    confirmDeletePO: 'Delete this purchase order?',

    // ── Inventory admin ───────────────────────────────────────
    inventoryTitle: 'Inventory', inventoryCount: 'movements total',
    addInventory: '+ Add Movement', newInventory: 'Add Inventory Movement',
    movementType: 'Movement Type',
    typeIn: 'In', typeOut: 'Out', typeAdjust: 'Adjustment',
    refType: 'Reference Type', refId: 'Reference ID',
    inventoryNotes: 'Notes',
    colType: 'Type', colQty: 'Qty', colRefType: 'Reference', colUser: 'User',

    // ── Order Details admin ───────────────────────────────────
    orderDetailsTitle: 'Order Details',
    addOrderDetail: '+ Add Detail',
    editOrderDetail: 'Edit Detail', newOrderDetail: 'Add Order Detail',
    orderId: 'Order ID', unitPrice: 'Unit Price (€)', discountLabel: 'Discount (€)',
    colOrder: 'Order', colProduct: 'Product',
    colUnitPrice: 'Unit Price', colDiscount: 'Discount',
    confirmDeleteDetail: 'Delete this detail?',

    // ── User Management ───────────────────────────────────────
    usersTitle: 'User Management',
    colUser: 'User', colRoles: 'Roles', colStatus: 'Status',
    active: 'Active', inactive: 'Inactive',
    editRoles: 'Edit Roles', saveRoles: 'Save Roles',
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