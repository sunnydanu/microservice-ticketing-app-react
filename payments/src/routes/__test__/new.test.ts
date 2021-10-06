import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@freakybug/ms-common';
import { stripe } from '../../stripe';

// jest.mock('../../stripe')


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

it('it return 204 with valid inputs', async () => {

    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(order.userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201);

    // test with jest mock   uncomment below lines and rename strip.ts in mock folder


    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    // expect(chargeOptions.source).toEqual('tok_visa');
    // expect(chargeOptions.amount).toEqual(10 * 100);
    // expect(chargeOptions.currency).toEqual('usd')


    // test with stripe

    const charges = await stripe.charges.list({
        limit: 50,
    });

    const stripeCharge = charges.data.find(charge => {
        return charge.amount === price * 100
    })

    expect(stripeCharge).toBeDefined();
})