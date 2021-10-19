import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../app";

jest.mock("../nats-wrapper");

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

export const validTicket = {
  title: "test title",
  price: 100.0,
};

export interface InputTicket {
  title?: string;
  price?: number;
}

export interface InputOptions {
  cookie?: string[];
}

export const postTicket = (
  ticket: InputTicket = { ...validTicket },
  options: InputOptions = {}
) => {
  const agent = request(app).post("/api/tickets");
  if (options.cookie) {
    agent.set("Cookie", options.cookie);
  }
  return agent.send(ticket);
};

export const successTicket = () => {
  return postTicket({ ...validTicket }, { cookie: getValidCookie() });
};

export const getValidCookie = (
  payload = {
    email: "user1@mail.com",
    id: "payload-id",
  }
): string[] => {
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`express:sess=${base64}`];
};
