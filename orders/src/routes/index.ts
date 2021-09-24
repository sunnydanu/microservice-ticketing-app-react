import { requireAuth } from '@freakybug/ms-common';
import express, { Request, Response } from 'express';
import { OrderModel } from '../models/order';
import { TicketModel } from '../models/ticket';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
    const orders = await OrderModel.find({
        userId: req.currentUser!.id,
    }).populate({ path: "ticket", model: TicketModel });

    res.send(orders);
})

export { router as indexOrderRouter };