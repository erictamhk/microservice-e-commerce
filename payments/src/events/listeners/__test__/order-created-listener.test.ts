import mongoose from "mongoose";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@sgtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: "ticket-id",
      price: 1000,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe("order created listener", () => {
  it("replicates the order info", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order).toBeDefined();
    expect(order!.id).toEqual(data.id);
    expect(order!.price).toEqual(data.ticket.price);
    expect(order!.version).toEqual(data.version);
  });
  it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
  // it("", async () => {});
});
