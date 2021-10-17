import request from "supertest";
import { app } from "../../app";

describe("signup", () => {
  it("return a 201 on successful signup", async () => {
    const response = await request(app).post("/api/users/signup").send({
      email: "test@test.com",
      password: "password",
    });

    expect(response.status).toBe(201);
  });
});
