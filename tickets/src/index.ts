import mongoose from 'mongoose';

import { app } from './app';

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
  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });

})();

