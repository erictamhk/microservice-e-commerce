import request from "supertest";
import { app } from "../../app";
import { successTicket, validTicket } from "../../test/setup";
import { Ticket } from "../../models/ticket";

const getTickets = (ticketId: string = "") => {
  return request(app).get(`/api/tickets/${ticketId}`).send({});
};

describe("show", () => {
  it("returns a 404 if the ticket is not found", async () => {
    await getTickets("ticket-id").expect(404);
  });
  it("returns the ticket if the ticket is found", async () => {
    const response = await successTicket().expect(201);

    const ticketResponse = await getTickets(response.body.id).expect(200);

    expect(ticketResponse.body.title).toEqual(validTicket.title);
    expect(ticketResponse.body.price).toEqual(validTicket.price);
  });
  // it("", async () => {});
  // it("", async () => {});
  // it("", async () => {});
  // it("", async () => {});
});
