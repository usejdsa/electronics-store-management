import { useEffect, useState } from "react";
import axios from "axios";

function Customers() {
  const [customers, setCustomers] = useState([]);

  const [emri, setEmri] = useState("");
  const [mbiemri, setMbiemri] = useState("");
  const [email, setEmail] = useState("");
  const [telefoni, setTelefoni] = useState("");
  const [adresa, setAdresa] = useState("");
  const [qyteti, setQyteti] = useState("");

  const [editId, setEditId] = useState(null);

  // GET
  const fetchCustomers = () => {
    axios.get("http://localhost:5000/api/customers")
      .then(res => setCustomers(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // CREATE / UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = { emri, mbiemri, email, telefoni, adresa, qyteti };

    if (editId) {
      // UPDATE
      axios.put(`http://localhost:5000/api/customers/${editId}`, data)
        .then(() => {
          setEditId(null);
          setEmri("");
          setMbiemri("");
          setEmail("");
          setTelefoni("");
          setAdresa("");
          setQyteti("");
          fetchCustomers();
        })
        .catch(err => console.log("UPDATE ERROR:", err));
    } else {
      // CREATE
      axios.post("http://localhost:5000/api/customers", data)
        .then(() => {
          setEmri("");
          setMbiemri("");
          setEmail("");
          setTelefoni("");
          setAdresa("");
          setQyteti("");
          fetchCustomers();
        })
        .catch(err => console.log(err));
    }
  };

  // DELETE
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/customers/${id}`)
      .then(() => {
        setCustomers(prev => prev.filter(c => c.id !== id));
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Customers</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input placeholder="Emri" value={emri} onChange={e => setEmri(e.target.value)} />
        <input placeholder="Mbiemri" value={mbiemri} onChange={e => setMbiemri(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Telefoni" value={telefoni} onChange={e => setTelefoni(e.target.value)} />
        <input placeholder="Adresa" value={adresa} onChange={e => setAdresa(e.target.value)} />
        <input placeholder="Qyteti" value={qyteti} onChange={e => setQyteti(e.target.value)} />

        <button type="submit">
          {editId ? "Update Customer" : "Add Customer"}
        </button>
      </form>

      {/* LIST */}
      {customers.map(c => (
        <div key={c.id}>
          {c.emri} {c.mbiemri}

          <button onClick={() => {
            setEditId(c.id);
            setEmri(c.emri);
            setMbiemri(c.mbiemri);
            setEmail(c.email);
            setTelefoni(c.telefoni);
            setAdresa(c.adresa);
            setQyteti(c.qyteti);
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

export default Customers;