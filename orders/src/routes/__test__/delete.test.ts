import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Order, OrderDoc, OrderStatus } from "../../models/order";
import { Ticket, TicketDoc } from "../../models/ticket";
import { getValidCookie } from "../../test/setup";

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

const createOrder = async (
  ticket: TicketDoc,
  userId: string
): Promise<OrderDoc> => {
  const order = Order.build({
    ticket,
    userId,
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();
  return order;
};

describe("delete order", () => {
  it("marks an order as cancelled", async () => {
    const user = {
      email: "user1@mail.com",
      id: "user1",
    };
    const ticket = await createTickets();
    const order = await createOrder(ticket, user.id);

    const response = await request(app)
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", getValidCookie(user))
      .send({})
      .expect(200);

    expect(response.body.id).toEqual(order.id);
    expect(response.body.ticket.id).toEqual(ticket.id);
    expect(response.body.status).toEqual(OrderStatus.Cancelled);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
  });
  it("returns an error if one user tries to delete another users order", async () => {
    const user1 = {
      email: "user1@mail.com",
      id: "user1",
    };
    const user2 = {
      email: "user2@mail.com",
      id: "user2",
    };
    const ticket = await createTickets();
    const order = await createOrder(ticket, user1.id);

    const response = await request(app)
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", getValidCookie(user2))
      .send({})
      .expect(401);
  });
  // it("", async () => {});
  // it("", async () => {});
  it("emits an order cancelled event", async () => {
    const user = {
      email: "user1@mail.com",
      id: "user1",
    };
    const ticket = await createTickets();
    const order = await createOrder(ticket, user.id);

    const response = await request(app)
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", getValidCookie(user))
      .send({})
      .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
