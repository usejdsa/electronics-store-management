import { useEffect, useState } from "react";
import axios from "axios";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    emri_kompanise: "",
    kontakti: "",
    email: "",
    telefoni: "",
    adresa: "",
  });

  const fetchSuppliers = () => {
    axios.get("http://localhost:5000/api/suppliers")
      .then(res => setSuppliers(res.data));
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // 🔥 CREATE + UPDATE
  const handleSubmit = () => {
    if (editId) {
      // UPDATE
      axios.put(`http://localhost:5000/api/suppliers/${editId}`, form)
        .then(() => {
          setEditId(null);
          resetForm();
          fetchSuppliers();
        });
    } else {
      // CREATE
      axios.post("http://localhost:5000/api/suppliers", form)
        .then(() => {
          resetForm();
          fetchSuppliers();
        });
    }
  };

  const resetForm = () => {
    setForm({
      emri_kompanise: "",
      kontakti: "",
      email: "",
      telefoni: "",
      adresa: "",
    });
  };

  const deleteSupplier = (id) => {
    axios.delete(`http://localhost:5000/api/suppliers/${id}`)
      .then(fetchSuppliers);
  };

  return (
    <div>
      <h2>Suppliers</h2>

      <input
        placeholder="Company"
        value={form.emri_kompanise}
        onChange={e => setForm({ ...form, emri_kompanise: e.target.value })}
      />

      <input
        placeholder="Contact"
        value={form.kontakti}
        onChange={e => setForm({ ...form, kontakti: e.target.value })}
      />

      <input
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Phone"
        value={form.telefoni}
        onChange={e => setForm({ ...form, telefoni: e.target.value })}
      />

      <input
        placeholder="Address"
        value={form.adresa}
        onChange={e => setForm({ ...form, adresa: e.target.value })}
      />

      <button onClick={handleSubmit}>
        {editId ? "Update Supplier" : "Add Supplier"}
      </button>

      <ul>
        {suppliers.map(s => (
          <li key={s.id}>
            {s.emri_kompanise} ({s.kontakti})

            <button onClick={() => {
              setEditId(s.id);
              setForm({
                emri_kompanise: s.emri_kompanise || "",
                kontakti: s.kontakti || "",
                email: s.email || "",
                telefoni: s.telefoni || "",
                adresa: s.adresa || "",
              });
            }}>
              Edit
            </button>

            <button onClick={() => deleteSupplier(s.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Suppliers;