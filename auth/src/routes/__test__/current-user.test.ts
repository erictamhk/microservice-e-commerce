import request from "supertest";
import { validUser, InputOptions } from "../../test/setup";
import { app } from "../../app";

const getCurrenctUser = (options: InputOptions = {}) => {
  const agent = request(app).get("/api/users/currentuser");
  if (options.cookie) {
    agent.set("Cookie", options.cookie);
  }
  return agent.send();
};

describe("currentuser", () => {
  it("responds with details about the current user", async () => {
    const cookie = await signup();

    const response = await getCurrenctUser({
      cookie,
    });

    expect(Object.keys(response.body)).toEqual(["currentUser"]);
    expect(Object.keys(response.body.currentUser)).toEqual([
      "id",
      "email",
      "iat",
    ]);
    expect(response.body.currentUser.email).toEqual(validUser.email);
  });
  it("responds with null if not authenticated", async () => {
    const response = await getCurrenctUser();

    expect(Object.keys(response.body)).toEqual(["currentUser"]);
    expect(response.body.currentUser).toBeNull();
  });
});
