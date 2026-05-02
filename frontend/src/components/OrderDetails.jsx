import { useEffect, useState } from "react";
import axios from "axios";

function OrderDetails() {
  const [details, setDetails] = useState([]);
  const [editId, setEditId] = useState(null);

  const [orderId, setOrderId] = useState("");
  const [productId, setProductId] = useState("");
  const [sasia, setSasia] = useState("");
  const [cmimiUnit, setCmimiUnit] = useState("");
  const [zbritja, setZbritja] = useState("");

  const fetchDetails = () => {
    axios.get("http://localhost:5000/api/order-details")
      .then(res => setDetails(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      order_id: Number(orderId),
      product_id: Number(productId),
      sasia: Number(sasia),
      cmimi_unit: Number(cmimiUnit),
      zbritja: zbritja ? Number(zbritja) : 0
    };

    if (editId) {
      // UPDATE
      axios.put(`http://localhost:5000/api/order-details/${editId}`, payload)
        .then(() => {
          setEditId(null);
          setOrderId("");
          setProductId("");
          setSasia("");
          setCmimiUnit("");
          setZbritja("");
          fetchDetails();
        });
    } else {
      // CREATE
      axios.post("http://localhost:5000/api/order-details", payload)
        .then(() => {
          setOrderId("");
          setProductId("");
          setSasia("");
          setCmimiUnit("");
          setZbritja("");
          fetchDetails();
        });
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/order-details/${id}`)
      .then(fetchDetails);
  };

  return (
    <div>
      <h2>Order Details</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />

        <input
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />

        <input
          placeholder="Quantity"
          value={sasia}
          onChange={(e) => setSasia(e.target.value)}
        />

        <input
          placeholder="Price"
          value={cmimiUnit}
          onChange={(e) => setCmimiUnit(e.target.value)}
        />

        <input
          placeholder="Discount"
          value={zbritja}
          onChange={(e) => setZbritja(e.target.value)}
        />

        <button type="submit">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {details.map(d => (
        <div key={d.id}>
          Order #{d.order_id} - Product #{d.product_id} - Qty: {d.sasia}

          <button onClick={() => {
            setEditId(d.id);
            setOrderId(d.order_id);
            setProductId(d.product_id);
            setSasia(d.sasia);
            setCmimiUnit(d.cmimi_unit);
            setZbritja(d.zbritja || "");
          }}>
            Edit
          </button>

          <button onClick={() => handleDelete(d.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default OrderDetails;