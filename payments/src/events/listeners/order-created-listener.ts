import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCreatedEvent } from "@sgtickets/common";
import { queueGroupName } from "./quene-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    //
  }
}
