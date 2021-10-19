import request from "supertest";
import { app } from "../../app";
import { successTicket } from "../../test/setup";
import { Ticket } from "../../models/ticket";

const getTickets = (ticketId: string = "") => {
  return request(app).get(`/api/tickets/${ticketId}`).send({});
};

describe("show", () => {
  it("return a 404 if the ticket is not found", async () => {
    await getTickets("ticket-id").expect(404);
  });
  // it("", async () => {});
  // it("", async () => {});
  // it("", async () => {});
  // it("", async () => {});
  // it("", async () => {});
});
