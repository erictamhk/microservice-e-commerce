import express, { Request, Response } from "express";
import { body } from "express-validator";
import { isValidObjectId } from "mongoose";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  currentUser,
  NotAuthorizedError,
  BadRequestError,
} from "@sgtickets/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  currentUser,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw new NotFoundError();
    }
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }
    if (ticket.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }
    ticket.set({
      title,
      price,
    });
    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
