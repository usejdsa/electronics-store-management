import { useEffect, useState } from "react";
import axios from "axios";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [emertimi, setEmertimi] = useState("");
  const [pershkrimi, setPershkrimi] = useState("");
  const [editId, setEditId] = useState(null);

  // GET categories
  const fetchCategories = () => {
    axios.get("http://localhost:5000/api/categories")
      .then(res => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // CREATE / UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      // UPDATE
      axios.put(`http://localhost:5000/api/categories/${editId}`, {
        emertimi,
        pershkrimi
      })
      .then(() => {
        setEditId(null);
        setEmertimi("");
        setPershkrimi("");
        fetchCategories();
      })
      .catch(err => console.log("UPDATE ERROR:", err));

    } else {
      // CREATE
      axios.post("http://localhost:5000/api/categories", {
        emertimi,
        pershkrimi
      })
      .then(() => {
        setEmertimi("");
        setPershkrimi("");
        fetchCategories();
      })
      .catch(err => console.log(err));
    }
  };

  // DELETE
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/categories/${id}`)
      .then(() => {
        setCategories(prev => prev.filter(c => c.id !== id));
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Categories</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Emertimi"
          value={emertimi}
          onChange={(e) => setEmertimi(e.target.value)}
        />

        <input
          type="text"
          placeholder="Pershkrimi"
          value={pershkrimi}
          onChange={(e) => setPershkrimi(e.target.value)}
        />

        <button type="submit">
          {editId ? "Update Category" : "Add Category"}
        </button>
      </form>

      {/* LIST */}
      {categories.map(c => (
        <div key={c.id}>
          {c.emertimi} - {c.pershkrimi}

          <button onClick={() => {
            setEditId(c.id);
            setEmertimi(c.emertimi);
            setPershkrimi(c.pershkrimi);
          }}>
            Edit
          </button>

          <button onClick={() => handleDelete(c.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Categories;