import React, { useState } from "react";

function App() {
  const [orderId, setOrderId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [response, setResponse] = useState(null);

  const API = "http://localhost:8000/api/v1";

  const headers = {
    "Content-Type": "application/json",
    "X-Api-Key": "key_test_abc123",
    "X-Api-Secret": "secret_test_xyz789"
  };

  const createOrder = async () => {
    const res = await fetch("http://localhost:8000/api/v1/orders", {
      method: "POST",
      headers,
      body: JSON.stringify({ amount: 5000 })
    });
    const data = await res.json();
    setOrderId(data.id);
    setResponse(data);
  };

  const createPayment = async () => {
    const res = await fetch("http://localhost:8000/api/v1/payments", {
      method: "POST",
      headers,
      body: JSON.stringify({
        order_id: orderId,
        method: "upi",
        vpa: "test@upi"
      })
    });
    const data = await res.json();
    setPaymentId(data.id);
    setResponse(data);
  };

  const getPayment = async () => {
    const res = await fetch(`http://localhost:8000/api/v1/payments/${paymentId}`, {
      headers
    });
    const data = await res.json();
    setResponse(data);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Payment Gateway Demo</h1>

      <button onClick={createOrder}>Create Order</button>
      <br /><br />

      <button onClick={createPayment} disabled={!orderId}>
        Create Payment
      </button>
      <br /><br />

      <button onClick={getPayment} disabled={!paymentId}>
        Get Payment
      </button>

      <pre style={{ marginTop: 30 }}>
        {JSON.stringify(response, null, 2)}
      </pre>
    </div>
  );
}

export default App;
