const db = require('../src/database/index');
const app = require('../src/app');
const supertest = require('supertest');

async function cleanDatabase() {
	await db.query('DELETE FROM users');
}

beforeAll(cleanDatabase);
afterAll(()=>{
  cleanDatabase
  db.end();
});

let token = "";

describe('POST /sign-up', () => {
  it('should respond with 201 if correct', async ()=>{
    const body = {
        name: "pikachu",
        email: "jefissu@gmail.com",
        password: "123456",
        passwordConfirmation: "123456"
    }

    const response = await supertest(app).post('/api/sign-up').send(body);

    expect(response.status).toBe(201);
  });

  it('should respond with 422 if body is wrong', async()=>{
    const body = {
        email: "jefissu@gmail.com",
        password: "123456",
        passwordConfirmation: "123456"
    }
    const response = await supertest(app).post('/api/sign-up').send(body);

    expect(response.status).toBe(422);
  })
});

describe('POST /sign-in', () => {
    it('should respond with 200 if correct', async ()=>{
      const body = {
        email: "jefissu@gmail.com",
        password: "123456"
      }
      const response = await supertest(app).post('/api/sign-in').send(body);
      expect(response.status).toBe(200);
      token = response.body.token;
    });

    it('should respond with 422 if body is wrong', async()=>{
      const body = {
        email: "jefissu@gmail.com",
        password: "1234567"
      }
      const response = await supertest(app).post('/api/sign-in').send(body);
      
      expect(response.status).toBe(422);
    })
  });

describe('POST /logout', () => {
  it('should answer 200 if authorization is correct', async()=>{
    const header = { Authorization: `Bearer ${token}` };

    const response = await supertest(app).post('/api/logout').set(header);

    expect(response.status).toBe(200);
  })
});

describe('GET /api/log', () => {
  it('should respond with 200 if correct', async ()=>{
    console.log(token);
    const header = { Authorization: `Bearer ${token}` };

    const response = await supertest(app).get('/api/log').set(header);
    expect(response.status).toBe(200);
  });
})

describe('POST /api/entry', () => {
  it('should respond with 201 if correct', async ()=>{
    console.log(token);
    const header = { Authorization: `Bearer ${token}` };
    const obj = {
      num: "100.50", 
      description: "testesss"
    }

    const response = await supertest(app).post('/api/entry').send(obj).set(header);
    console.log(response);
    expect(response.status).toBe(201);
  });
})