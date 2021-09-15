import mongoose from 'mongoose';

import { app } from './app';

(async () => {

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is missing');
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('mongodb connected successfully')
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });

})();

