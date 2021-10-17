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

const signoutUser = () => {
  return request(app).post("/api/users/signout").send({});
};

describe("signout", () => {
  it("responds 200 when signout", async () => {
    await signupUser().expect(201);
    const response = await signoutUser();

    expect(response.status).toBe(200);
  });
  it("responds empty cookie when signout", async () => {
    await signupUser().expect(201);
    const response = await signoutUser();

    expect(response.get("Set-Cookie")[0]).toEqual(
      "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );
  });
});
