import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError,
    NotAuthorizedError,
    OrderStatus
} from '@freakybug/ms-common';
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post('/api/payments', requireAuth, validateRequest,
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty(),
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId != req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for canncelled order');
        }


        const payment_response = await stripe.charges.create({
            amount: order.price * 100,
            currency: 'usd',
            source: token,
            description: 'My First Test Charge (created for API docs)',

        })

        const payment = Payment.build({ orderId, stripeId: payment_response.id })
        await payment.save();

        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        });


        res.status(201).send({ id: payment.id })
    });

export { router as createChargeRouter };