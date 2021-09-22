import request from 'supertest';
import { app } from '../../app';
import { Ticket, TicketModel } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';


it('has a route hander listening to /api/tickets for post requests', async () => {

    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).not.toEqual(404);
})

it('can be only be accessed if the user is signed in', async () => {
    await request(app)
        .post('/api/tickets')
        .send({}).expect(401);
})

it('returns other then 401 if the user is signed in', async () => {

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
})

it('returns an error if an invalid title is provide', async () => {

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 10
        }).expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            price: 10
        }).expect(400);

})

it('returns an error if an invalid price is provide', async () => {

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'IamValidTitle',
            price: -10
        }).expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'IamValidTitle',
        }).expect(400);


})

it('creates a tickets with a valid input', async () => {

    let tickets = await TicketModel.find({});
    expect(tickets.length).toEqual(0);
    const title: string = 'IamValidTitle';
    const price: number = 10;

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price
        }).expect(201);

    tickets = await TicketModel.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual(title);
    expect(tickets[0].price).toEqual(price);

});


it('publishes an event', async () => {


    let tickets = await TicketModel.find({});
    expect(tickets.length).toEqual(0);
    const title: string = 'IamValidTitle';
    const price: number = 10;

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price
        }).expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
