import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@sgtickets/common";

import { User } from "../models/user";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUSer = await User.findOne({ email });
    if (!existingUSer) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(
      existingUSer.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    if (!process.env.JWT_KEY) {
      throw new Error("Server Error here!");
    }
    const key = process.env.JWT_KEY;
    const userJwt = jwt.sign(
      {
        id: existingUSer.id,
        email: existingUSer.email,
      },
      key
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(existingUSer);
  }
);

export { router as signinRouter };
