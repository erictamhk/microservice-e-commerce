import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "testing-key";
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

declare global {
  var signup: (user?: InputUser) => Promise<string[]>;
}

export const validUser = {
  email: "user1@mail.com",
  password: "P4ssword",
};

export interface InputUser {
  email?: string;
  password?: string;
}

export interface InputOptions {
  cookie?: string[];
}

global.signup = async (
  user: InputUser = { ...validUser }
): Promise<string[]> => {
  const response = await request(app)
    .post("/api/users/signup")
    .send(user)
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
