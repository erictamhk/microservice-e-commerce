import { Subjects, Publisher, PaymentCreatedEvent } from "@sgtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
