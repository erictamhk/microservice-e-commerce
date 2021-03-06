import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { Ticket, TicketDoc } from "../../models/ticket";
import { postOrder, getValidCookie } from "../../test/setup";

import { natsWrapper } from "../../nats-wrapper";

const createTickets = async (): Promise<TicketDoc> => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: `concert-test`,
    price: 20,
    id: ticketId,
  });
  await ticket.save();
  return ticket;
};

describe("new order", () => {
  it("can only be accessed if the user is signed in", async () => {
    await postOrder().expect(401);
  });
  it("returns a status other than 401 if the user is signed in", async () => {
    const response = await postOrder(
      { ticketId: "test" },
      { cookie: getValidCookie() }
    );

    expect(response.status).not.toEqual(401);
  });
  it("returns an error if an invalid ticketId is provided", async () => {
    await postOrder({ ticketId: "test" }, { cookie: getValidCookie() }).expect(
      400
    );
    await postOrder({ ticketId: "" }, { cookie: getValidCookie() }).expect(400);
    await postOrder({}, { cookie: getValidCookie() }).expect(400);
  });
  it("returns an error if the ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    await postOrder({ ticketId }, { cookie: getValidCookie() }).expect(404);
  });
  it("return an error if the ticket is already reserved", async () => {
    const ticket = await createTickets();

    const order = Order.build({
      ticket,
      userId: "test-user-id",
      status: OrderStatus.Created,
      expiresAt: new Date(),
    });
    await order.save();

    await postOrder(
      { ticketId: ticket.id },
      { cookie: getValidCookie() }
    ).expect(400);
  });
  it("reserves a ticket", async () => {
    const ticket = await createTickets();

    await postOrder(
      { ticketId: ticket.id },
      { cookie: getValidCookie() }
    ).expect(201);
  });
  // it("", async () => {});p

  it("emits an order created event", async () => {
    const ticket = await createTickets();

    await postOrder(
      { ticketId: ticket.id },
      { cookie: getValidCookie() }
    ).expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
