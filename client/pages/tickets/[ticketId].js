import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: { ticketId: ticket.id },
    onSuccess: (order) => console.log(order),
  });
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button onClick={doRequest} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  let ticket = null;
  try {
    const { ticketId } = context.query;

    const { data } = await client.get(`/api/tickets/${ticketId}`);

    ticket = data;
  } catch (err) {
    console.error(err);
  }

  return { ticket };
};

export default TicketShow;