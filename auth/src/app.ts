import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSessions from 'cookie-session';


import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@freakybug/ms-common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSessions({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'

}))
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req: Request) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };