import mongoose from "mongoose";
import { postOrder, getValidCookie } from "../../test/setup";

describe("new order", () => {
  it("can only be accessed if the user is signed in", async () => {
    await postOrder().expect(401);
  });
  it("returns a status other than 401 if the user is signed in", async () => {
    const response = await postOrder(
      { ticketId: "test" },
      { cookie: getValidCookie() }
    );

    expect(response.status).not.toEqual(401);
  });
  it("returns an error if an invalid ticketId is provided", async () => {
    await postOrder({ ticketId: "test" }, { cookie: getValidCookie() }).expect(
      400
    );
    await postOrder({ ticketId: "" }, { cookie: getValidCookie() }).expect(400);
    await postOrder({}, { cookie: getValidCookie() }).expect(400);
  });
  it("returns an error if the ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    await postOrder({ ticketId }, { cookie: getValidCookie() }).expect(404);
  });
  // it("return an error if the ticket is already reserved", async () => {});
  // it("reserves a ticket", async () => {});
  // it("", async () => {});
});
