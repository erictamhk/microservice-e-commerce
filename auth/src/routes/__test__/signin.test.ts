import request from "supertest";
import { validUser, InputUser } from "../../test/setup";
import { app } from "../../app";

const signinUser = (user: InputUser = { ...validUser }) => {
  return request(app).post("/api/users/signin").send(user);
};

describe("signin", () => {
  it("responds 201 when given valid credentials", async () => {
    await signup();
    const response = await signinUser();

    expect(response.status).toBe(201);
  });
  it("responds with a cookie when given valid credentials", async () => {
    await signup();
    const response = await signinUser();

    expect(response.get("Set-Cookie")).toBeDefined();
  });
  it("fails when a email that does not exists is supplied", async () => {
    await signinUser().expect(400);
  });
  it("fails when an incorrect password is supplied", async () => {
    await signup();
    const response = await signinUser({
      email: validUser.email,
      password: "abc",
    });

    expect(response.status).toBe(400);
  });
});
