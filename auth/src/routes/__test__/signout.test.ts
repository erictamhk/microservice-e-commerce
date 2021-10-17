import request from "supertest";
import { app } from "../../app";

const signoutUser = () => {
  return request(app).post("/api/users/signout").send({});
};

describe("signout", () => {
  it("responds 200 when signout", async () => {
    await signup();
    const response = await signoutUser();

    expect(response.status).toBe(200);
  });
  it("responds empty cookie when signout", async () => {
    await signup();
    const response = await signoutUser();

    expect(response.get("Set-Cookie")[0]).toEqual(
      "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );
  });
});
