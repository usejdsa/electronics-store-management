import { useEffect, useState } from "react";
import axios from "axios";

function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    supplier_id: "",
    product_id: "",
    sasia: "",
    cmimi_blerjes: "",
  });

  const fetchData = async () => {
    const ordersRes = await axios.get("http://localhost:5000/api/purchase-orders");
    setOrders(ordersRes.data);

    const suppliersRes = await axios.get("http://localhost:5000/api/suppliers");
    setSuppliers(suppliersRes.data);

    const productsRes = await axios.get("http://localhost:5000/api/products");
    setProducts(productsRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addOrder = async () => {
    await axios.post("http://localhost:5000/api/purchase-orders", form);
    fetchData();

    setForm({
      supplier_id: "",
      product_id: "",
      sasia: "",
      cmimi_blerjes: "",
    });
  };

  return (
    <div>
      <h2>Purchase Orders</h2>

      {/* SUPPLIERS */}
      <select
        value={form.supplier_id}
        onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
      >
        <option value="">Select Supplier</option>
        {suppliers.map((s) => (
          <option key={s.id} value={s.id}>
            {s.emri_kompanise}
          </option>
        ))}
      </select>

      {/* PRODUCTS */}
      <select
        value={form.product_id}
        onChange={(e) => setForm({ ...form, product_id: e.target.value })}
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.emri}
          </option>
        ))}
      </select>

      <input
        placeholder="Sasia"
        value={form.sasia}
        onChange={(e) => setForm({ ...form, sasia: e.target.value })}
      />

      <input
        placeholder="Cmimi"
        value={form.cmimi_blerjes}
        onChange={(e) => setForm({ ...form, cmimi_blerjes: e.target.value })}
      />

      <button onClick={addOrder}>Add</button>

      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            {o.emri_kompanise} - {o.product_name} - {o.totali}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PurchaseOrders;