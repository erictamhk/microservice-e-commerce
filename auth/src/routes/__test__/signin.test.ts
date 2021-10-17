import request from "supertest";
import { app } from "../../app";

const validUser = {
  email: "user1@mail.com",
  password: "P4ssword",
};

interface inputUser {
  email?: string;
  password?: string;
}

const signupUser = (user: inputUser = { ...validUser }) => {
  return request(app).post("/api/users/signup").send(user);
};

const signinUser = (user: inputUser = { ...validUser }) => {
  return request(app).post("/api/users/signin").send(user);
};

describe("signin", () => {
  it("responds 201 when given valid credentials", async () => {
    await signupUser().expect(201);
    const response = await signinUser();

    expect(response.status).toBe(201);
  });
  it("responds with a cookie when given valid credentials", async () => {
    await signupUser().expect(201);
    const response = await signinUser();

    expect(response.get("Set-Cookie")).toBeDefined();
  });
  it("fails when a email that does not exists is supplied", async () => {
    await signinUser().expect(400);
  });
  it("fails when an incorrect password is supplied", async () => {
    await signupUser().expect(201);
    const response = await signinUser({
      email: validUser.email,
      password: "abc",
    });

    expect(response.status).toBe(400);
  });
});
