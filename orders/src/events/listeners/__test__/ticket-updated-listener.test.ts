import mongoose from "mongoose";
import { TicketUpdatedListener } from "../ticker-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@sgtickets/common";
import { Message } from "node-nats-streaming";
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

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const ticket = await createTickets();
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "concert-new-title",
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

describe("ticket updated listener", () => {
  it("finds, updates, and saves a ticket", async () => {
    const { listener, data, msg, ticket: beforeTicket } = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
    expect(ticket!.title).not.toEqual(beforeTicket!.title);
    expect(ticket!.price).not.toEqual(beforeTicket!.price);
    expect(ticket!.version).toBeGreaterThan(beforeTicket!.version);
  });
  it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
  it("dose not call ack if the event has a skipped version number", async () => {
    const { listener, data, msg, ticket: beforeTicket } = await setup();

    data.version = beforeTicket!.version + 10000;
    try {
      await listener.onMessage(data, msg);
    } catch (err) {}

    // const ticket = await Ticket.findById(data.id);
    // expect(ticket).toBeDefined();
    // expect(ticket!.title).toEqual(data.title);
    // expect(ticket!.price).toEqual(data.price);
    // expect(ticket!.title).not.toEqual(beforeTicket!.title);
    // expect(ticket!.price).not.toEqual(beforeTicket!.price);
    // expect(ticket!.version).toBeGreaterThan(beforeTicket!.version);

    expect(msg.ack).not.toHaveBeenCalled();
  });
  it("dose not change the ticket if the event has a skipped version number", async () => {
    const { listener, data, msg, ticket: beforeTicket } = await setup();

    data.version = beforeTicket!.version + 10000;
    try {
      await listener.onMessage(data, msg);
    } catch (err) {}

    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).not.toEqual(data.title);
    expect(ticket!.price).not.toEqual(data.price);
    expect(ticket!.title).toEqual(beforeTicket!.title);
    expect(ticket!.price).toEqual(beforeTicket!.price);
    expect(ticket!.version).toEqual(beforeTicket!.version);
  });
  // it("", async () => {});
});
