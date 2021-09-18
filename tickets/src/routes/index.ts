import { requireAuth } from '@freakybug/ms-common';
import express, { Request, Response } from 'express';
import { TicketModel } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', requireAuth, async (req: Request, res: Response) => {
    const tickets = await TicketModel.find({ userId: req.currentUser!.id });

    res.send(tickets);
});

export { router as indexTicketRouter };
