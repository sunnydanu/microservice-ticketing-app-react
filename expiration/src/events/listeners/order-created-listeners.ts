import { Listener, Subjects, OrderCreatedEvent } from '@freakybug/ms-common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedEventListener extends Listener<OrderCreatedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

        console.log('Waiting for ', delay, ' milliseconds to process the job:', data.id)
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay,
        });

        msg.ack();
    };
}