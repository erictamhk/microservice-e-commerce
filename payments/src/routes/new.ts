import express, { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@sgtickets/common";
import { stripe } from "../stripe";
import { OrderDoc, Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("Token is required"),
    body("orderId")
      .not()
      .isEmpty()
      .withMessage("orderID is require")
      .bail()
      .custom((input: string) => isValidObjectId(input))
      .withMessage("Invalid orderId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }
    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError("Cannot pay for an complete order");
    }

    await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
