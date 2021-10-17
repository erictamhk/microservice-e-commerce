import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUSer = await User.findOne({ email });
    if (existingUSer) {
      throw new BadRequestError("Email in use");
    }
    const user = User.build({ email, password });
    await user.save();

    if (!process.env.JWT_KEY) {
      throw new Error("Server Error here!");
    }
    const key = process.env.JWT_KEY;
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      key
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
