import mongoose from "mongoose";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@sgtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket, TicketDoc } from "../../../models/ticket";

const createTickets = async (): Promise<TicketDoc> => {
  const ticket = Ticket.build({
    title: `concert-test`,
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  return ticket;
};

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const ticket = await createTickets();
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

describe("order created listener", () => {
  it("reserve the ticket", async () => {
    const { listener, data, msg, ticket: beforeTicket } = await setup();
    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(beforeTicket.id);
    expect(ticket).toBeDefined();
    expect(ticket!.orderId).toBeDefined();
    expect(ticket!.orderId).toEqual(data.id);
  });
  it("acks the message", async () => {
    const { listener, data, msg, ticket } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
  it("publishes a ticket updated event", async () => {
    const { listener, data, msg, ticket } = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(ticketUpdatedData.id).toEqual(ticket.id);
    expect(ticketUpdatedData.version).toEqual(ticket.version + 1);
  });
  // it("", async () => {});
});
