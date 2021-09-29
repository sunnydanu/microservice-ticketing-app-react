import { Publisher, Subjects, TicketCreatedEvent } from '@freakybug/ms-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
