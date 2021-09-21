import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { randomBytes } from 'crypto';

(async () => {

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is missing');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('mongodb connected successfully')
  } catch (error) {
    console.log(error);
  }

  try {
    await natsWrapper.connect('ticketing', `publisher-${randomBytes(4).toString('hex')}`, 'http://nats-srv:4222');

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });

})();





