import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@freakybug/ms-common';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator'
import { TicketModel } from '../models/ticket';
import { OrderModel } from '../models/order';

const EXPIRATION_WINDOW_SECONDS: number = 15 * 60;


const router = express.Router();

router.post('/api/orders', requireAuth, [

    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
],
    validateRequest,
    async (req: Request, res: Response) => {

        const { ticketId } = req.body;

        // Find the ticket tge user us trying to order in the databse
        const ticket = await TicketModel.findById(ticketId);

        if (!ticket) {
            throw new NotFoundError();
        }

        // Make sure that this ticket is not already reserved

        const exisitingOrder = await ticket.isReserved();
        if (exisitingOrder) {
            throw new BadRequestError('Ticket is alredy reserved.')
        }

        // Calculate an expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        // Build the order and save it to the database
        const order =  await OrderModel.create({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });

        // Publish an event saying that an order was created 
        res.status(201).send(order);
    })

export { router as newOrderRouter };