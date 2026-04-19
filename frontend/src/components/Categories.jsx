import { useEffect, useState } from "react";
import axios from "axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ emertimi: "", pershkrimi: "" });

  // GET ALL
  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/api/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CREATE
  const addCategory = async () => {
    await axios.post("http://localhost:5000/api/categories", form);
    setForm({ emertimi: "", pershkrimi: "" });
    fetchData();
  };

  // DELETE
  const deleteCategory = async (id) => {
    await axios.delete(`http://localhost:5000/api/categories/${id}`);
    fetchData();
  };

  return (
    <div>
      <h2>Categories</h2>

      <input
        placeholder="Emertimi"
        value={form.emertimi}
        onChange={(e) => setForm({ ...form, emertimi: e.target.value })}
      />

      <input
        placeholder="Pershkrimi"
        value={form.pershkrimi}
        onChange={(e) => setForm({ ...form, pershkrimi: e.target.value })}
      />

      <button onClick={addCategory}>Add</button>

      <ul>
        {categories.map((c) => (
          <li key={c.id}>
            {c.emertimi} - {c.pershkrimi}
            <button onClick={() => deleteCategory(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}