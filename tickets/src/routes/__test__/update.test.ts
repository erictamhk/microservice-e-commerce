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
  // it("returns a 401 if the user dose not own the ticket", async () => {});
  // it("return a 400 if the user provides an invalid title or price", async () => {});
  // it("updates the ticket provided valid inputs", async () => {});
});
