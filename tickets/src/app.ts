import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSessions from 'cookie-session';

import { currentUser, errorHandler, NotFoundError } from '@freakybug/ms-common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSessions({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'

}))

app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);


app.all('*', async (req: Request) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };