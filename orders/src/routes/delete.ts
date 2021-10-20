import express, { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@sgtickets/common";
import { Order } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    if (!isValidObjectId(orderId)) {
      throw new NotFoundError();
    }

    const order = await Order.findById(orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    res.send(order);
  }
);

export { router as deleteOrderRouter };
