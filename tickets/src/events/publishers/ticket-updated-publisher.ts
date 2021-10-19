import { Subjects, Publisher, TicketUpdatedEvent } from "@sgtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
