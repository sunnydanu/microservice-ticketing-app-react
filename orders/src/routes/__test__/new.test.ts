import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { OrderModel, OrderStatus } from '../../models/order';
import { TicketModel, Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = await TicketModel.create({
    title: 'concert',
    price: 20,
  });


  await OrderModel.create({
    ticket,
    userId: 'laskdflkajsdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = await TicketModel.create({
    title: 'concert',
    price: 20,
  });


  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created events', async () => {

  const ticket = await TicketModel.create({
    title: 'concert',
    price: 20,
  });


  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})