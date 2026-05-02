import { useEffect, useState } from "react";
import axios from "axios";

function Inventory() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    product_id: "",
    lloji: "hyrje",
    sasia: "",
    shenime: ""
  });

  const fetchData = () => {
    axios.get("http://localhost:5000/api/inventory")
      .then(res => setItems(res.data));

    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = () => {
    const payload = {
      product_id: Number(form.product_id),
      lloji: "hyrje",
      sasia: Number(form.sasia),
      referenca_lloji: null,
      referenca_id: null,
      shenime: form.shenime || "",
      user_id: null
    };

    console.log("SENDING INVENTORY:", payload);

    if (editId) {
      axios.put(`http://localhost:5000/api/inventory/${editId}`, payload)
        .then(() => {
          setEditId(null);
          resetForm();
          fetchData();
        });
    } else {
      axios.post("http://localhost:5000/api/inventory", payload)
        .then(() => {
          resetForm();
          fetchData();
        });
    }
  };

  const resetForm = () => {
    setForm({
      product_id: "",
      lloji: "hyrje",
      sasia: "",
      shenime: ""
    });
  };

  const deleteItem = (id) => {
    axios.delete(`http://localhost:5000/api/inventory/${id}`)
      .then(fetchData);
  };

  return (
    <div>
      <h2>Inventory</h2>

      {/* PRODUCT SELECT */}
      <select
        value={form.product_id}
        onChange={e => setForm({ ...form, product_id: e.target.value })}
      >
        <option value="">Select Product</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>
            {p.emri}
          </option>
        ))}
      </select>

      {/* QUANTITY (NOW sasia) */}
      <input
        placeholder="Sasia"
        value={form.sasia}
        onChange={e => setForm({ ...form, sasia: e.target.value })}
      />

      <input
        placeholder="Notes"
        value={form.shenime}
        onChange={e => setForm({ ...form, shenime: e.target.value })}
      />

      <button onClick={handleSubmit}>
        {editId ? "Update" : "Add"}
      </button>

      <ul>
        {items.map(i => (
          <li key={i.id}>
            {i.product_name} - {i.sasia}

            <button onClick={() => {
              setEditId(i.id);
              setForm({
                product_id: i.product_id,
                lloji: i.lloji,
                sasia: i.sasia,
                shenime: i.shenime || ""
              });
            }}>
              Edit
            </button>

            <button onClick={() => deleteItem(i.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Inventory;