
import { requireAuth, validateRequest } from '@freakybug/ms-common';
import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import { TicketModel } from '../models/ticket';

const router = express.Router();

router.post('/api/tickets', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greate then zero'),
], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await TicketModel.create({ title, price, userId: req.currentUser!.id });
    
    res.status(201).send(ticket);
});

export { router as createTicketRouter };