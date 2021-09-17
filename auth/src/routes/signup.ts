import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { validateRequest, BadRequestError } from '@dev.org/ms-common';
import { UserModel } from "../models/user";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    const user = await UserModel.create({ email, password });

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt
    };

    res.status(201).send(user);

  }
);

export { router as signupRouter };
