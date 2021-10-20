import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be definded");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be definded");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be definded");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be definded");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be definded");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    console.log("connected to NATs");

    natsWrapper.client.on("close", () => {
      console.log("NATs connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  } catch (err) {
    console.error(err);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to MongoDb");
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("orders v1");
    console.log("Listening to port 3000");
  });
};

start();
