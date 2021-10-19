import request from "supertest";
import { app } from "../../app";
import {
  successTicket,
  getValidCookie,
  validTicket,
  InputTicket,
  InputOptions,
} from "../../test/setup";
import { Ticket } from "../../models/ticket";

const updateTicket = (
  ticketId: string = "test-ticket-id",
  ticket: InputTicket = { ...validTicket },
  options: InputOptions = { cookie: getValidCookie() }
) => {
  const agent = request(app).put(`/api/tickets/${ticketId}`);
  if (options.cookie) {
    agent.set("Cookie", options.cookie);
  }
  return agent.send(ticket);
};

describe("update", () => {
  it("returns a 404 if the provided id does not exist", async () => {
    await updateTicket().expect(404);
  });
  it("returns a 401 if the user is not authenticated", async () => {
    await updateTicket(
      "test-ticket-id",
      { ...validTicket },
      { cookie: undefined }
    ).expect(401);
  });
  it("returns a 401 if the user dose not own the ticket", async () => {
    const oriTicketResponse = await successTicket();

    await updateTicket(
      oriTicketResponse.body.id,
      { title: "updated-title", price: 200 },
      { cookie: getValidCookie({ email: "abc@abc.com", id: "fake-id" }) }
    ).expect(401);
  });
  it("return a 400 if the user provides an invalid title or price", async () => {
    const oriTicketResponse = await successTicket();

    await updateTicket(
      oriTicketResponse.body.id,
      { title: "", price: 200 },
      { cookie: getValidCookie() }
    ).expect(400);

    await updateTicket(
      oriTicketResponse.body.id,
      { price: 200 },
      { cookie: getValidCookie() }
    ).expect(400);

    await updateTicket(
      oriTicketResponse.body.id,
      { title: "updated-title", price: -200 },
      { cookie: getValidCookie() }
    ).expect(400);

    await updateTicket(
      oriTicketResponse.body.id,
      { title: "updated-title" },
      { cookie: getValidCookie() }
    ).expect(400);
  });
  it("updates the ticket provided valid inputs", async () => {
    const oriTicketResponse = await successTicket();

    await updateTicket(
      oriTicketResponse.body.id,
      { title: "updated-title", price: 200 },
      { cookie: getValidCookie() }
    ).expect(200);

    const ticket = await Ticket.findById(oriTicketResponse.body.id);

    expect(ticket?.title).not.toEqual(validTicket.title);
    expect(ticket?.price).not.toEqual(validTicket.price);

    expect(ticket?.title).toEqual("updated-title");
    expect(ticket?.price).toEqual(200);
  });
});
