import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
    //  crate an instance of ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    });

    // save the ticket to the database
    await ticket.save();

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make two separate change to the ticket we fetched
    firstInstance!.price = 10;
    secondInstance!.price = 15;

    // save the first fetched ticket
    await firstInstance!.save();

    // save the second fetched ticket
    try {
        await secondInstance!.save()
    } catch (err) {
        return
    }

    throw new Error('Should not reach this point')

});

it('increments the version number on multiple save', async () => {

    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    });

    // save the ticket to the database
    await ticket.save();

    expect(ticket.version).toEqual(0);

    // save the ticket to the database second
    await ticket.save();

    expect(ticket.version).toEqual(1);

    // save the ticket to the database third
    await ticket.save();

    expect(ticket.version).toEqual(2);

})
