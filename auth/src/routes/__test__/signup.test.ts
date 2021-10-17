import request from "supertest";
import { validUser, InputUser } from "../../test/setup";
import { app } from "../../app";

const signupUser = (user: InputUser = { ...validUser }) => {
  return request(app).post("/api/users/signup").send(user);
};

describe("signup", () => {
  it("return a 201 on successful signup", async () => {
    const response = await signupUser();

    expect(response.status).toBe(201);
  });

  it("return a 400 with an invalid email", async () => {
    const response = await signupUser({
      email: "abctest",
      password: validUser.password,
    });

    expect(response.status).toBe(400);
  });

  it("return a 400 with an invalid password", async () => {
    const response = await signupUser({
      email: validUser.email,
      password: "bab",
    });

    expect(response.status).toBe(400);
  });

  it("return a 400 with missing password", async () => {
    const response = await signupUser({ email: validUser.email });

    expect(response.status).toBe(400);
  });

  it("return a 400 with missing email", async () => {
    const response = await signupUser({ password: validUser.password });

    expect(response.status).toBe(400);
  });

  it("return a 400 with missing email and password", async () => {
    const response = await signupUser({});

    expect(response.status).toBe(400);
  });

  it("disallows duplicate emails", async () => {
    await signupUser().expect(201);
    const response = await signupUser();

    expect(response.status).toBe(400);
  });

  it("sets a cookie after successful signup", async () => {
    const response = await signupUser().expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
