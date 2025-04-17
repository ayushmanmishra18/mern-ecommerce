import axios from "axios";

const Checkout = ({ userEmail, orderDetails }) => {
  const sendReceipt = async () => {
    try {
      await axios.post("/api/auth/send-receipt", { email: userEmail, orderDetails });
      alert("Receipt sent to your email!");
    } catch (error) {
      alert("Error sending receipt");
    }
  };

  return <button onClick={sendReceipt}>Complete Purchase</button>;
};

export default Checkout;
