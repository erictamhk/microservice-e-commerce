import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCreatedEvent } from "@sgtickets/common";
import { queueGroupName } from "./quene-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {}
}
