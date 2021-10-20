import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  OrderCancelledEvent,
  OrderStatus,
} from "@sgtickets/common";
import { queueGroupName } from "./quene-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findOne({
      id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    msg.ack();
  }
}
