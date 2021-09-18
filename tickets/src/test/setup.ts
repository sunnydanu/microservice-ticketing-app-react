import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from 'mongoose';
import { app } from '../app'
import request from 'supertest';
import jwt from 'jsonwebtoken';


let mongo: any;
declare global {
    var signin: () => string[];
}

beforeAll(async () => {
    process.env.JWT_KEY = 'someSecretTest';

    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});

    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})

global.signin = () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    // Build a JWT payload . {id,email}
    const payload = {
        id,
        email: 'test@test.com'
    }

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session token
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JOSN and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie with encoded data
    return [`express:sess=${base64}`];

}