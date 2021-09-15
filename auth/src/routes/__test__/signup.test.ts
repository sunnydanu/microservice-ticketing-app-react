import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'user@example.com',
            password: 'password'
        })
        .expect(201);
});

it('return 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'userexample.com'
        })
        .expect(400);
});

it('return 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            password: '12'
        })
        .expect(400);
});

it('return 400 with missing email and password', async () => {

    await request(app)
        .post('/api/users/signup')
        .send({ 'email': 'test@example.com' })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({ 'password': '565481asdsd' })
        .expect(400);
});

it('disallows duplicate emails', async () => {

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'jest@example.com',
            password: 'password'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'jest@example.com',
            password: 'password'
        })
        .expect(400);
});


it('sets a cookie on successfull signup', async () => {

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'jest@example.com',
            password: 'password'
        })
        .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined()
});


