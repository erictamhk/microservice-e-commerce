import mongoose from "mongoose";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteEvent, OrderStatus } from "@sgtickets/common";
import { Message } from "node-nats-streaming";
import { Order, OrderDoc } from "../../../models/order";
import { Ticket, TicketDoc } from "../../../models/ticket";

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
  userId: string,
  status: OrderStatus
): Promise<OrderDoc> => {
  const order = Order.build({
    ticket,
    userId,
    status,
    expiresAt: new Date(),
  });
  await order.save();
  return order;
};

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const user = {
    email: "user1@mail.com",
    id: "user1",
  };
  const ticket = await createTickets();
  const order = await createOrder(ticket, user.id, OrderStatus.Created);

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket, order };
};

describe("expiration complete", () => {
  it("when order expiration complete, the order canncelled", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(data.orderId);

    expect(updatedOrder).toBeDefined();
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });
  it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
  it("completed order will not expirate", async () => {
    const { listener, data, msg, order } = await setup();

    order.status = OrderStatus.Complete;
    await order.save();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(data.orderId);
    expect(updatedOrder!.status).not.toEqual(OrderStatus.Cancelled);
    expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
  });
  it("emit on OrderCancelled event", async () => {
    const { listener, data, msg, order } = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const orderCancelledData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(orderCancelledData.id).toEqual(order.id);
    expect(orderCancelledData.version).toEqual(order.version + 1);
  });
});
