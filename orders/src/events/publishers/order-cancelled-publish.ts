import { Subjects, Publisher, OrderCancelledEvent } from "@sgtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
