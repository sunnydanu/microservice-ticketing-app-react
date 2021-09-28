import { Listener, Subjects, TicketCreatedEvent } from '@freakybug/ms-common';
import { Message } from 'node-nats-streaming';
import { TicketModel } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';



export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {

        const { id, title, price } = data;

        await TicketModel.build({ id, title, price });

        msg.ack();
    }

}