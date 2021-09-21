import { Publisher, Subjects, TicketCreatedEvent } from '@freakybug/ms-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}