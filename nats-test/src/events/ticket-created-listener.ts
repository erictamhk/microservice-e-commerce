import { Message, Stan } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subjects } from "./subjests";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-service";
  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("event data", data);

    msg.ack();
  }
}
