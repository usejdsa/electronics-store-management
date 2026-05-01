import { useEffect, useState } from "react";
import axios from "axios";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    emri: "",
    mbiemri: "",
    email: "",
    telefoni: "",
    adresa: "",
    qyteti: "",
  });

  const fetchCustomers = () => {
    axios.get("http://localhost:5000/api/customers")
      .then(res => setCustomers(res.data));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const addCustomer = () => {
    axios.post("http://localhost:5000/api/customers", form)
      .then(() => {
        fetchCustomers();
        setForm({
          emri: "",
          mbiemri: "",
          email: "",
          telefoni: "",
          adresa: "",
          qyteti: "",
        });
      });
  };

  const deleteCustomer = (id) => {
    axios.delete(`http://localhost:5000/api/customers/${id}`)
      .then(fetchCustomers);
  };

  return (
    <div>
      <h2>Customers</h2>

      <input placeholder="Emri" onChange={e => setForm({...form, emri: e.target.value})} />
      <input placeholder="Mbiemri" onChange={e => setForm({...form, mbiemri: e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input placeholder="Telefoni" onChange={e => setForm({...form, telefoni: e.target.value})} />
      <input placeholder="Adresa" onChange={e => setForm({...form, adresa: e.target.value})} />
      <input placeholder="Qyteti" onChange={e => setForm({...form, qyteti: e.target.value})} />

      <button onClick={addCustomer}>Add</button>

      <ul>
        {customers.map(c => (
          <li key={c.id}>
            {c.emri} {c.mbiemri}
            <button onClick={() => deleteCustomer(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Customers;