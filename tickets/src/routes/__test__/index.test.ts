import request from "supertest";
import { app } from "../../app";
import { successTicket, validTicket } from "../../test/setup";
import { Ticket } from "../../models/ticket";

const getTickets = () => {
  return request(app).get(`/api/tickets`).send({});
};

describe("index", () => {
  it("can fetch a list of tickets", async () => {
    await successTicket();
    await successTicket();
    await successTicket();

    const response = await getTickets().expect(200);

    expect(response.body.length).toEqual(3);
  });
  // it("", async () => {});
  // it("", async () => {});
  // it("", async () => {});
});
