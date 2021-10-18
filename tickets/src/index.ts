import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be definded");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be definded");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to MongoDb");
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("tickets v1");
    console.log("Listening to port 3000");
  });
};

start();
