import mongoose from "mongoose";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent } from "@sgtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket, TicketDoc } from "../../../models/ticket";

const createTickets = async (orderId: string): Promise<TicketDoc> => {
  const ticket = Ticket.build({
    title: `concert-test`,
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  ticket.set({ orderId: orderId });
  await ticket.save();
  return ticket;
};

const setup = async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const listener = new OrderCancelledListener(natsWrapper.client);
  const ticket = await createTickets(orderId);
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

describe("order cancelled listener", () => {
  it("reopen the ticket", async () => {
    const { listener, data, msg, ticket: beforeTicket } = await setup();
    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(beforeTicket.id);
    expect(ticket).toBeDefined();
    expect(ticket!.orderId).not.toEqual(data.id);
    expect(ticket!.orderId).not.toBeDefined();
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
