import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
console.clear();
const stan = nats.connect('ticketing', `publisher-${randomBytes(4).toString('hex')}`, {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Publisher connected to NATS server');

    const data = JSON.stringify({
        id: 123,
        title: 'concert'
    });
    stan.publish('ticket:created', data, () => console.log('Event Published'));
})