/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { users } = require('../models');

chai.should();
chai.use(chaiHttp);

const validData = {
  name: 'test123',
  email: 'test@gmail.com',
  password: 'test123',
};
const validLogin = {
  email: 'belsebub2001@gmail.com',
  password: 'belsebub',
};
const incorrectPasswordLogin = {
  name: 'shizzy',
  email: 'shizzy@gmail.com',
  password: 'shizziii',
};
const invalidPassword = {
  name: 'test123',
  email: 'test@gmail.com',
  password: 'test',
};
const invalidEmail = {
  name: 'test123',
  email: 'test',
  password: 'test123',
};
const invalidName = {
  name: '',
  email: 'test@gmail.com',
  password: 'test123',
};

describe('Test user registration', () => {
  it('It should not create user when name is incorrect', async () => {
    const res = await chai.request(app)
      .post('/signUp').send(invalidName);
    res.should.have.status(500);
    res.body.should.be.a('object');
    res.body.should.have.property('status');
    res.body.should.have.property('message');
  });
  it('It should not create user when password is below 6 or null', async () => {
    const res = await chai.request(app)
      .post('/signUp').send(invalidPassword);
    res.should.have.status(500);
    res.body.should.be.a('object');
    res.body.should.have.property('status');
    res.body.should.have.property('message');
  });
  it('It should not create user when email is invalid', async () => {
    const res = await chai.request(app)
      .post('/signUp').send(invalidEmail);
    res.should.have.status(500);
    res.body.should.be.a('object');
    res.body.should.have.property('status');
    res.body.should.have.property('message');
  });
  it('should register user', async () => {
    const res = await chai
      .request(app)
      .post('/signUp')
      .send(validData);
    res.should.have.status(201);
    res.body.should.be.a('object');
    res.body.should.have.property('status');
    res.body.should.have.property('message');
    users.destroy({
      where: { email: validData.email },
    });
  });
  it('should not register user who is already in the database', async () => {
    const res = await chai
      .request(app)
      .post('/signUp')
      .send(validData);
    res.should.have.status(201);
    res.body.should.be.a('object');
    res.body.should.have.property('status');
    res.body.should.have.property('message');

    const res2 = await chai
      .request(app)
      .post('/signUp')
      .send(validData);
    res2.should.have.status(500);
    res2.body.should.be.a('object');
    res2.body.should.have.property('status');
    res2.body.should.have.property('message');
    users.destroy({
      where: { email: validData.email },
    });
  });
});

describe('test user log in endpoint', () => {
  it('should log a user in', async () => {
    const res = await chai
      .request(app)
      .post('/login')
      .send(validLogin);
    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.should.have.property('status');
    res.body.should.have.property('message');
    res.body.should.have.property('token');
  });
  it('It should not log user in when password is below 6 or null', async () => {
    const res = await chai.request(app)
      .post('/login').send(invalidPassword);
    res.should.have.status(500);
    res.body.should.be.a('object');
    res.body.should.have.property('status');
    res.body.should.have.property('message');
  });
  it('It should not log user in when email is invalid', async () => {
    const res = await chai.request(app)
      .post('/login').send(invalidEmail);
    res.should.have.status(500);
    res.body.should.be.a('object');
    res.body.should.have.property('status');
    res.body.should.have.property('message');
  });
  it('It should not create user when password is below 6 or null', async () => {
    const res = await chai.request(app)
      .post('/signUp').send(invalidPassword);
    res.should.have.status(500);
    res.body.should.be.a('object');
    res.body.should.have.property('status');
    res.body.should.have.property('message');
  });
  it('only logs in only registered users', async () => {
    const res = await chai.request(app)
      .post('/login').send(validData);
    res.should.have.status(500);
    res.body.should.be.a('object');
    res.body.should.have.property('status');
    res.body.should.have.property('message');
  });
  it('should not log user in when password isnt matching', async () => {
    const res = await chai.request(app)
      .post('/login').send(incorrectPasswordLogin);
    res.should.have.status(500);
    res.body.should.be.a('object');
    res.body.should.have.property('status');
    res.body.should.have.property('message');
  });
  it('should log a user out', async () => {
    const res = await chai
      .request(app)
      .post('/login')
      .send(validLogin);
    res.should.have.status(200);
    res.body.should.be.a('object');
    res.body.should.have.property('status');
    res.body.should.have.property('message');
    res.body.should.have.property('token');
    const response = await chai.request(app)
      .get('/logout').set('authorization', `Bearer ${res.body.token}`);
    response.should.have.status(200);
    response.body.should.be.a('object');
    response.body.should.have.property('message');
  });
});
