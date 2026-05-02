import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [editId, setEditId] = useState(null);

  const [customerId, setCustomerId] = useState("");
  const [customers, setCustomers] = useState([]);
  const [userId, setUserId] = useState("");
  const [totali, setTotali] = useState("");
  const [shenime, setShenime] = useState("");


  // GET
  const fetchOrders = () => {
    axios.get("http://localhost:5000/api/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
  fetchOrders();

  axios.get("http://localhost:5000/api/customers")
    .then(res => setCustomers(res.data));
}, []);

  // CREATE + UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      customer_id: Number(customerId),
      user_id: userId ? Number(userId) : null,
      statusi: "pending",
      totali: Number(totali),
      shenime: shenime
    };

    if (editId) {
      // UPDATE
      axios.put(`http://localhost:5000/api/orders/${editId}`, payload)
        .then(() => {
          setEditId(null);
          setCustomerId("");
          setUserId("");
          setTotali("");
          setShenime("");
          fetchOrders();
        })
        .catch(err => console.log("UPDATE ERROR:", err));
    } else {
      // CREATE
      axios.post("http://localhost:5000/api/orders", payload)
        .then(() => {
          setCustomerId("");
          setUserId("");
          setTotali("");
          setShenime("");
          fetchOrders();
        })
        .catch(err => console.log("CREATE ERROR:", err));
    }
  };

  // DELETE
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/orders/${id}`)
      .then(() => fetchOrders())
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Orders</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
       <select
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}>
            <option value="">Select Customer</option>

            {customers.map(c => (
                <option key={c.id} value={c.id}>
                {c.emri} {c.mbiemri}
                </option>
            ))}
        </select>

        <input
          type="number"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <input
          type="number"
          placeholder="Total"
          value={totali}
          onChange={(e) => setTotali(e.target.value)}
        />

        <input
          type="text"
          placeholder="Notes"
          value={shenime}
          onChange={(e) => setShenime(e.target.value)}
        />

        <button type="submit">
          {editId ? "Update Order" : "Add Order"}
        </button>
      </form>

      {/* LIST */}
      {orders.map(o => (
        <div key={o.id}>
          Order #{o.id} - {o.statusi} - {o.totali}€

          <button onClick={() => {
            setEditId(o.id);
            setCustomerId(o.customer_id || "");
            setUserId(o.user_id || "");
            setTotali(o.totali || "");
            setShenime(o.shenime || "");
          }}>
            Edit
          </button>

          <button onClick={() => handleDelete(o.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Orders;