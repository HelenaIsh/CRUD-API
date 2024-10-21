import http from 'http';
import { User } from '../src/server';

interface SimulatedResponse {
    status?: number; 
    body: User;
    response?: Object      
  }
describe('CRUD API tests for /api/users', () => {
  let createdUserId = '';

  const simulateRequest = (method: string, path: string, body?: any): Promise<SimulatedResponse> => {
    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          method,
          path,
          headers: {
            'Content-Type': 'application/json',
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () =>
            resolve({ status: res.statusCode, body: JSON.parse(data || '{}') }),
          );
        },
      );

      req.on('error', reject);
      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  };

  it('should get all users', async () => {
    try {
      const res = await simulateRequest('GET', '/api/users');
      expect(res.response).toBe([]);
    } catch (error) {
      console.error('Error in creating user:', error);
    }
  });

  it('should create a new user', async () => {
    const newUser = {
      username: 'John Doe',
      age: 30,
      hobbies: ['reading', 'sports'],
    };

    try {
      const res: any = await simulateRequest('POST', '/api/users', newUser);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('username', 'John Doe');
      expect(res.body).toHaveProperty('age', 30);
      expect(res.body.hobbies).toEqual(expect.arrayContaining(['reading']));
      createdUserId = res.body.id;
    } catch (error) {
      console.error('Error in creating user:', error);
    }
  });
  
  it('should return the created user by ID', async () => {
    try {
      const res: any = await simulateRequest(
        'GET',
        `/api/users/${createdUserId}`,
      );
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', createdUserId);
      expect(res.body).toHaveProperty('username', 'John Doe');
      expect(res.body).toHaveProperty('age', 30);
    } catch (error) {
      console.error('Error in creating user:', error);
    }
  });
});
