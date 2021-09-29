import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@freakybug/ms-common';
import { TicketModel } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const ticket = await TicketModel.build({
      id,
      title,
      price,
    });
   

    msg.ack();
  }
}
