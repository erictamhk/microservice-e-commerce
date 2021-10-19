import { NotFoundError } from "@sgtickets/common";
import { isValidObjectId } from "mongoose";
import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new NotFoundError();
  }

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    throw new NotFoundError();
  }
  res.send(ticket);
});

export { router as showTicketRouter };
