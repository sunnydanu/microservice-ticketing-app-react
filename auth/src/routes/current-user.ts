import express from 'express';
import jwt from 'jsonwebtoken'

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {

  let currentuser: any = null;
  if (req.session?.jwt) {
    try {
      console.log('currentuser',process.env.JWT_KEY)
      currentuser = jwt.verify(req.session.jwt,process.env.JWT_KEY!)
    } catch (error) {
      
      console.log('Invalid jwt',error);
    }

  }
  return res.send({ currentuser });


});

export { router as currentUserRouter };
