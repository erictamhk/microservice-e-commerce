import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order }) => {
  return (
    <div>
      <h1>Order</h1>
      <h4>Id: {order.id}</h4>
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
