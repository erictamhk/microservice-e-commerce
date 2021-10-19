import { getValidCookie, validTicket, postTicket } from "../../test/setup";
import { Ticket } from "../../models/ticket";

describe("create", () => {
  it("has a route handler listening to /api/tickets for post request", async () => {
    const response = await postTicket();

    expect(response.status).not.toEqual(404);
  });
  it("can only be accessed if the user is signed in", async () => {
    await postTicket().expect(401);
  });
  it("returns a status other than 401 if the user is signed in", async () => {
    const response = await postTicket({}, { cookie: getValidCookie() });

    expect(response.status).not.toEqual(401);
  });
  it("returns an error if an invalid title is provided", async () => {
    await postTicket(
      { title: "", price: 10 },
      { cookie: getValidCookie() }
    ).expect(400);
    await postTicket({ price: 10 }, { cookie: getValidCookie() }).expect(400);
  });
  it("returns an error if an invalid price is provied", async () => {
    await postTicket(
      { title: "ticket-title", price: -10 },
      { cookie: getValidCookie() }
    ).expect(400);
    await postTicket(
      { title: "ticket-title" },
      { cookie: getValidCookie() }
    ).expect(400);
  });
  it("creates a ticket with valid inputs", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    await postTicket({ ...validTicket }, { cookie: getValidCookie() }).expect(
      201
    );
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual(validTicket.title);
    expect(tickets[0].price).toEqual(validTicket.price);
  });
});
