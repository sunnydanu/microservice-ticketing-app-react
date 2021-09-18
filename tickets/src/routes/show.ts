
import { NotFoundError } from '@freakybug/ms-common';
import express, { Request, Response } from 'express';
import { TicketModel } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticket = await TicketModel.findById(req.params.id);

    if (!ticket) {
        throw new NotFoundError();
    }

    res.send(ticket);
});

export { router as showTicketRouter };