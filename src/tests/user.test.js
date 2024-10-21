var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import http from 'http';
describe('CRUD API tests for /api/users', () => {
    let createdUserId = '';
    const simulateRequest = (method, path, body) => {
        return new Promise((resolve, reject) => {
            const req = http.request({
                method,
                path,
                headers: {
                    'Content-Type': 'application/json',
                },
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data || '{}') }));
            });
            req.on('error', reject);
            if (body) {
                req.write(JSON.stringify(body));
            }
            req.end();
        });
    };
    it('should get all users', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield simulateRequest('GET', '/api/users');
            expect(res.response).toBe([]);
        }
        catch (error) {
            console.error('Error in creating user:', error);
        }
    }));
    it('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            username: 'John Doe',
            age: 30,
            hobbies: ['reading', 'sports'],
        };
        try {
            const res = yield simulateRequest('POST', '/api/users', newUser);
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('username', 'John Doe');
            expect(res.body).toHaveProperty('age', 30);
            expect(res.body.hobbies).toEqual(expect.arrayContaining(['reading']));
            createdUserId = res.body.id;
        }
        catch (error) {
            console.error('Error in creating user:', error);
        }
    }));
    it('should return the created user by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield simulateRequest('GET', `/api/users/${createdUserId}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', createdUserId);
            expect(res.body).toHaveProperty('username', 'John Doe');
            expect(res.body).toHaveProperty('age', 30);
        }
        catch (error) {
            console.error('Error in creating user:', error);
        }
    }));
});
