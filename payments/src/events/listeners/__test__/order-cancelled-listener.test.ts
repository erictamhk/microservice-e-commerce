import mongoose from "mongoose";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent, OrderStatus } from "@sgtickets/common";
import { Message } from "node-nats-streaming";
import { Order, OrderDoc } from "../../../models/order";

const createOrder = async (): Promise<OrderDoc> => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 1000,
    status: OrderStatus.Created,
    userId: "user1",
    version: 0,
  });
  await order.save();
  return order;
};

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = await createOrder();
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: "ticket-id",
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

describe("order cancelled listener", () => {
  // it("", async () => {});
  it("cancel the order when the id and version is right", async () => {
    const { listener, data, msg, order } = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(data.id);

    expect(updatedOrder).toBeDefined();
    expect(updatedOrder!.id).toEqual(data.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });
  it("dont cancel the order when the version is wrong", async () => {
    const { listener, data, msg, order } = await setup();
    data.version = 1000;
    try {
      await listener.onMessage(data, msg);
    } catch (err) {}

    expect(msg.ack).not.toHaveBeenCalled();
  });

  it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
