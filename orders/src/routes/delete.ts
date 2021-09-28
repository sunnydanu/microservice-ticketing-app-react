import express, { Request, Response } from 'express';
import {
    requireAuth,
    NotFoundError,
    NotAuthorizedError,
} from '@freakybug/ms-common';
import { OrderModel, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';
import { Ticket, TicketModel } from '../models/ticket';

const router = express.Router();

router.delete(
    '/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) => {
        const { orderId } = req.params;

        const order = await OrderModel.findById(orderId).populate({ path: "ticket", model: TicketModel });

        if (!order) {
            throw new NotFoundError();
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        order.status = OrderStatus.Cancelled;
        await order.save();

        // publishing an event saying this was cancelled!
        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            ticket: {
                id: (order?.ticket?.id) as string
            }
        });
        res.status(204).send(order);
    }
);

export { router as deleteOrderRouter };
