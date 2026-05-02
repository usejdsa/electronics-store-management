import { useEffect, useState } from 'react';
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [emri, setEmri] = useState('');
  const [cmimi, setCmimi] = useState('');
  const [editId, setEditId] = useState(null);

  // GET products
  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // POST product
  const handleSubmit = (e) => {
  e.preventDefault();

  if (editId) {
    // UPDATE
    axios.put(`http://localhost:5000/api/products/${editId}`, {
        emri,
        cmimi
    })
    .then(() => {
        setEditId(null);
        setEmri('');
        setCmimi('');
        fetchProducts();
    })
    .catch(err => console.log("UPDATE ERROR:", err));
  } else {
    // CREATE
    axios.post('http://localhost:5000/api/products', {
      emri,
      cmimi
    })
    .then(() => {
      setEmri('');
      setCmimi('');
      fetchProducts();
    });
  }
};

  // DELETE product
  const handleDelete = (id) => {
  axios.delete(`http://localhost:5000/api/products/${id}`)
    .then(() => {
      setProducts(prev => prev.filter(p => p.id !== id));
    })
    .catch(err => console.log(err));
};


  return (
    <div>
      <h2>Products</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product name"
          value={emri}
          onChange={(e) => setEmri(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={cmimi}
          onChange={(e) => setCmimi(e.target.value)}
        />
        <button type="submit">
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* LIST */}
    {products.map(p => (
  <div key={p.id}>
    {p.emri} - {p.cmimi}€

    <button onClick={() => {
      setEditId(p.id);
      setEmri(p.emri);
      setCmimi(p.cmimi);
    }}>
      Edit
    </button>

    <button onClick={() => handleDelete(p.id)}>
      Delete
    </button>
  </div>
))}
    </div>
  );
}

export default Products;