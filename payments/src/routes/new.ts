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


        res.send({ success: true })
    });

export { router as createChargeRouter };