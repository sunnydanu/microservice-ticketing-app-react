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



        res.status(201).send({ success: true, payment_response })
    });

export { router as createChargeRouter };