
import { requireAuth, validateRequest } from '@freakybug/ms-common';
import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import { TicketModel } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/tickets', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greate then zero'),
], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = await TicketModel.create({ title, price, userId: req.currentUser!.id });

    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
    });
    res.status(201).send(ticket);
});

export { router as createTicketRouter };