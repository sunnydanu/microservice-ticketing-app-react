import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from 'mongoose';
import { app } from '../app'
import request from 'supertest';

jest.setTimeout(30000);

let mongo: any;

beforeAll(async () => {
   
    process.env.JWT_KEY = 'someSecretTest';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
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

declare global {
    var signin: () => Promise<string[]>;
}

global.signin = async () => {
    const authResponse = await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@test.com', password: 'password' })
        .expect(201)
    return authResponse.get('Set-Cookie');
}