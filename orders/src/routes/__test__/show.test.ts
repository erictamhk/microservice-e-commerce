import request from "supertest";
import { app } from "../../app";
import { Order, OrderDoc, OrderStatus } from "../../models/order";
import { Ticket, TicketDoc } from "../../models/ticket";
import { getValidCookie } from "../../test/setup";

const createTickets = async (): Promise<TicketDoc> => {
  const ticket = Ticket.build({
    title: `concert-test`,
    price: 20,
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

describe("show order", () => {
  it("fetches the order", async () => {
    const user = {
      email: "user1@mail.com",
      id: "user1",
    };
    const ticket = await createTickets();
    const order = await createOrder(ticket, user.id);

    const response = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", getValidCookie(user))
      .send({})
      .expect(200);
    expect(response.body.id).toEqual(order.id);
    expect(response.body.ticket.id).toEqual(ticket.id);
  });
  it("returns an error if one user tries to fetch another users order", async () => {
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
      .get(`/api/orders/${order.id}`)
      .set("Cookie", getValidCookie(user2))
      .send({})
      .expect(401);
  });
  // it("", async () => {});
  // it("", async () => {});
});
