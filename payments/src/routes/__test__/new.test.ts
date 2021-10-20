import request from "supertest";
import mongoose from "mongoose";
import { OrderStatus } from "@sgtickets/common";
import { app } from "../../app";
import { getValidCookie } from "../../test/setup";
import { Order, OrderDoc } from "../../models/order";

const createOrder = async (
  userId: string = "user1",
  status: OrderStatus = OrderStatus.Created
): Promise<OrderDoc> => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 1000,
    status,
    userId,
    version: 0,
  });
  await order.save();
  return order;
};

const postPayment = (
  token: string = "test-token",
  orderId: string = new mongoose.Types.ObjectId().toHexString(),
  options: { cookie?: string[] } = { cookie: getValidCookie() }
): request.Test => {
  const agent = request(app).post("/api/payments");
  if (options?.cookie) {
    agent.set("Cookie", options.cookie);
  }
  return agent.send({
    token,
    orderId,
  });
};

describe("create payment", () => {
  it("returns a 404 when purchasing an order that does not exist", async () => {
    await postPayment().expect(404);
  });
  it("returns a 401 when purchasing an order that does not belong to the user", async () => {
    const order = await createOrder();
    const cookie = getValidCookie({ email: "user2@mail.com", id: "user2" });
    await postPayment("test-token", order.id, { cookie }).expect(401);
  });
  it("returns a 400 when purchasing a cancelled order", async () => {
    const user = { email: "user2@mail.com", id: "user2" };
    const order = await createOrder(user.id, OrderStatus.Cancelled);
    const cookie = getValidCookie(user);
    await postPayment("test-token", order.id, { cookie }).expect(400);
  });
  it("returns a 400 when purchasing a complete order", async () => {
    const user = { email: "user2@mail.com", id: "user2" };
    const order = await createOrder(user.id, OrderStatus.Complete);
    const cookie = getValidCookie(user);
    await postPayment("test-token", order.id, { cookie }).expect(400);
  });
});
