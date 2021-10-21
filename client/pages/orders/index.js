const OrderIndex = ({ orders }) => {
  return (
    <div>
      <h1>My Orders</h1>
      <ul>
        {orders.map((order) => {
          return (
            <li key={order.id}>
              {order.ticket.title} - {order.status}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  let orders = null;
  try {
    const { orderId } = context.query;

    const { data } = await client.get("/api/orders/");

    orders = data;
  } catch (err) {
    console.error(err);
  }

  return { orders };
};

export default OrderIndex;
