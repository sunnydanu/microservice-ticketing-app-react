import { Publisher, Subjects, TicketUpdatedEvent } from '@freakybug/ms-common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
