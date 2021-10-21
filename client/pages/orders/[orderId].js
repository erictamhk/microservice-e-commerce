import { useState, useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import StripeCheckout from "react-stripe-checkout";

const OrderShow = ({ order, currentUser }) => {
  if (!order) {
    return <h1>Order not found</h1>;
  }

  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: { orderId: order.id },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const msLeft = new Date(order.expiresAt) - new Date();
    if (msLeft > 0) {
      const timerId = setInterval(findTimeLeft, 1000);

      return () => {
        clearInterval(timerId);
      };
    }
  }, []);

  return (
    <div>
      <h1>Order</h1>
      <h4>Id: {order.id}</h4>
      {timeLeft <= 0 ? (
        <h1>Order Expired</h1>
      ) : (
        <h4>Time left to pay: {timeLeft} seconds</h4>
      )}
      <StripeCheckout
        token={(token) => doRequest({ token: token.id })}
        stripeKey="pk_test_YVzIqUTwiCYcEXO1DPqDrM98"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
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
