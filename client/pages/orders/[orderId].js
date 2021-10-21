import { useState, useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div>
      <h1>Order</h1>
      <h4>Id: {order.id}</h4>
      <h4>Time left to pay: {timeLeft} seconds</h4>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  let order = null;
  try {
    const { orderId } = context.query;

    const { data } = await client.get(`/api/orders/${orderId}`);

    order = data;
  } catch (err) {
    console.error(err);
  }

  return { order };
};

export default OrderShow;
