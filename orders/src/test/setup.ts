import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { ObjectId } from "mongoose";
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
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

export interface InputOptions {
  cookie?: string[];
}

export interface OrderOptions {
  ticketId?: string;
}

export const postOrder = (
  orderBody: OrderOptions = {
    ticketId: new mongoose.Types.ObjectId().toHexString(),
  },
  options: InputOptions = {}
) => {
  const agent = request(app).post("/api/orders");
  if (options.cookie) {
    agent.set("Cookie", options.cookie);
  }
  return agent.send(orderBody);
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
