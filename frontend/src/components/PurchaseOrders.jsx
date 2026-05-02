import { useEffect, useState } from "react";
import axios from "axios";

function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    supplier_id: "",
    product_id: "",
    sasia: "",
    cmimi_blerjes: "",
  });

  const fetchData = async () => {
    try {
      const ordersRes = await axios.get("http://localhost:5000/api/purchase-orders");
      setOrders(ordersRes.data);

      const suppliersRes = await axios.get("http://localhost:5000/api/suppliers");
      setSuppliers(suppliersRes.data);

      const productsRes = await axios.get("http://localhost:5000/api/products");
      setProducts(productsRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CREATE + UPDATE
  const handleSubmit = async () => {
    const payload = {
      supplier_id: Number(form.supplier_id),
      product_id: Number(form.product_id),
      sasia: Number(form.sasia),
      cmimi_blerjes: Number(form.cmimi_blerjes),
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/purchase-orders/${editId}`, payload);
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/purchase-orders", payload);
      }

      console.log("UPDATING WITH:", payload);
      console.log("EDIT ID:", editId);
      fetchData();

      setForm({
        supplier_id: "",
        product_id: "",
        sasia: "",
        cmimi_blerjes: "",
      });
    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/purchase-orders/${id}`);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Purchase Orders</h2>

      {/* FORM */}
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

      <button onClick={handleSubmit}>
        {editId ? "Update" : "Add"}
      </button>

      {/* LIST */}
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            {o.emri_kompanise} - {o.product_name} - {o.totali}

            <button
              onClick={() => {
                setEditId(o.id);
                setForm({
                  supplier_id: o.supplier_id || "",
                  product_id: o.product_id || "",
                  sasia: o.sasia || "",
                  cmimi_blerjes: o.cmimi_blerjes || "",
                });
              }}
            >
              Edit
            </button>

            <button onClick={() => handleDelete(o.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PurchaseOrders;