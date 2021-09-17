import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from 'mongoose';
import { app } from '../app'
import request from 'supertest';


let mongo: any;
declare global {
    var signin: () => Promise<string[]>;
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
 
global.signin = async () => {
    const authResponse = await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@test.com', password: 'password' })
        .expect(201)
    return authResponse.get('Set-Cookie');
}