import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSessions from 'cookie-session';

import { errorHandler, NotFoundError } from '@dev.org/ms-common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSessions({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'

}))
 

app.all('*', async (req: Request) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };