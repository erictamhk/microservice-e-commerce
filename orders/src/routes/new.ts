import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  BadRequestError,
  OrderStatus,
} from "@sgtickets/common";
import { isValidObjectId } from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .withMessage("TicketId must be provided")
      .bail()
      .custom((input: string) => isValidObjectId(input))
      .withMessage("Invalid TicketId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    //TODO: need to publish the order created event

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
