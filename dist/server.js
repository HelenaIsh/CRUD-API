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
import { parse } from 'url';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();
const users = [];
function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            }
            catch (error) {
                reject(error);
            }
        });
        req.on('error', (err) => reject(err));
    });
}
const server = http.createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedUrl = parse(req.url || '', true);
    const path = parsedUrl.pathname || '';
    const method = req.method || '';
    if (path === '/api/users' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    }
    else if (path.match(/^\/api\/users\/[a-zA-Z0-9-]+$/) && method === 'GET') {
        const userId = path.split('/')[3];
        if (!isValidUUID(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Invalid UUID' }));
        }
        const user = users.find((u) => u.id === userId);
        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User not found' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    }
    else if (path === '/api/users' && method === 'POST') {
        try {
            const body = yield parseRequestBody(req);
            const { username, age, hobbies } = body;
            if (!username || !age || !Array.isArray(hobbies)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Missing required fields' }));
            }
            const newUser = { id: uuidv4(), username, age, hobbies };
            users.push(newUser);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        }
        catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Server error' }));
        }
    }
    else if (path.match(/^\/api\/users\/[a-zA-Z0-9-]+$/) && method === 'PUT') {
        const userId = path.split('/')[3];
        if (!isValidUUID(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Invalid UUID' }));
        }
        try {
            const body = yield parseRequestBody(req);
            const { username, age, hobbies } = body;
            if (!username || !age || !Array.isArray(hobbies)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Missing required fields' }));
            }
            const userIndex = users.findIndex((u) => u.id === userId);
            if (userIndex === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'User not found' }));
            }
            users[userIndex] = { id: userId, username, age, hobbies };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users[userIndex]));
        }
        catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Server error' }));
        }
    }
    else if (path.match(/^\/api\/users\/[a-zA-Z0-9-]+$/) &&
        method === 'DELETE') {
        const userId = path.split('/')[3];
        if (!isValidUUID(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Invalid UUID' }));
        }
        const userIndex = users.findIndex((u) => u.id === userId);
        if (userIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User not found' }));
        }
        users.splice(userIndex, 1);
        res.writeHead(204);
        res.end();
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Endpoint not found' }));
    }
}));
const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
export default server;
