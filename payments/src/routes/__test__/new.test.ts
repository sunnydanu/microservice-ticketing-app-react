import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@freakybug/ms-common';


it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'some token',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);

})
it('returns a 401 when purchasing an order that does not belongs to user', async () => {

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 10,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'some token',
            orderId: order.id
        })
        .expect(401);


})
it('returns a 400 when purchasing cancelled order', async () => {
 
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 10,
        status: OrderStatus.Cancelled
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(order.userId))
        .send({
            token: 'some token',
            orderId: order.id
        })
        .expect(400);
})