import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Order, OrderDoc, OrderStatus } from "../../models/order";
import { Ticket, TicketDoc } from "../../models/ticket";
import { getValidCookie } from "../../test/setup";

const createTickets = async (num: number): Promise<TicketDoc[]> => {
  const tickets: TicketDoc[] = [];
  for (let i = 0; i < num; i++) {
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
      title: `concert${i}`,
      price: 20 + i,
      id: ticketId,
    });
    await ticket.save();
    tickets.push(ticket);
  }
  return tickets;
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

describe("index order", () => {
  it("fetches orders for an particular user", async () => {
    const tickets = await createTickets(3);
    const orderOne = await createOrder(tickets[0], "user1");
    const orderTwo = await createOrder(tickets[1], "user2");
    const orderThree = await createOrder(tickets[2], "user2");

    const response = await request(app)
      .get("/api/orders")
      .set("Cookie", getValidCookie({ email: "user2@mail.com", id: "user2" }))
      .send({})
      .expect(200);
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderTwo.id);
    expect(response.body[1].id).toEqual(orderThree.id);
    expect(response.body[0].ticket.id).toEqual(tickets[1].id);
    expect(response.body[1].ticket.id).toEqual(tickets[2].id);
  });
  // it("", async () => {});
  // it("", async () => {});
  // it("", async () => {});
});
