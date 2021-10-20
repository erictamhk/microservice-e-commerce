import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCancelledEvent } from "@sgtickets/common";
import { queueGroupName } from "./quene-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    //
  }
}
