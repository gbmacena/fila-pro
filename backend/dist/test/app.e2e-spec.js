"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("./../src/app.module");
const prisma_service_1 = require("../src/prisma/prisma.service");
describe('FilaPro API (e2e)', () => {
    let app;
    let prisma;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
        prisma = app.get(prisma_service_1.PrismaService);
    });
    afterEach(async () => {
        await prisma.ticket.deleteMany();
        await prisma.user.deleteMany();
    });
    afterAll(async () => {
        await app.close();
    });
    describe('Authentication', () => {
        it('should register a new user', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/register')
                .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            })
                .expect(201)
                .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data).toHaveProperty('message', 'Usuário registrado com sucesso');
            });
        });
        it('should login with valid credentials', async () => {
            await (0, supertest_1.default)(app.getHttpServer()).post('/auth/register').send({
                username: 'testuser2',
                email: 'test2@example.com',
                password: 'password123',
            });
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/login')
                .send({
                username: 'testuser2',
                password: 'password123',
            })
                .expect(201)
                .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data).toHaveProperty('access_token');
                expect(res.body.data).toHaveProperty('user');
                expect(res.body.data.user).toHaveProperty('id');
                expect(res.body.data.user).toHaveProperty('username', 'testuser2');
                expect(res.body.data.user).toHaveProperty('email', 'test2@example.com');
            });
        });
        it('should reject login with invalid credentials', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/login')
                .send({
                username: 'nonexistent',
                password: 'wrongpassword',
            })
                .expect(500)
                .expect((res) => {
                expect(res.body).toHaveProperty('statusCode', 500);
                expect(res.body).toHaveProperty('message', 'Internal server error');
            });
        });
    });
    describe('Queue Management', () => {
        let accessToken;
        let userId;
        beforeEach(async () => {
            await (0, supertest_1.default)(app.getHttpServer()).post('/auth/register').send({
                username: 'queueuser',
                email: 'queue@example.com',
                password: 'password123',
            });
            const loginResponse = await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/login')
                .send({
                username: 'queueuser',
                password: 'password123',
            });
            accessToken = loginResponse.body.data.access_token;
            userId = loginResponse.body.data.user.id;
        });
        it('should create a ticket', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/tickets')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201)
                .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data).toHaveProperty('code');
                expect(res.body.data).toHaveProperty('position');
                expect(res.body.data).toHaveProperty('estimatedWait');
                expect(typeof res.body.data.code).toBe('string');
                expect(typeof res.body.data.position).toBe('number');
                expect(typeof res.body.data.estimatedWait).toBe('number');
            });
        });
        it('should get queue state', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .get('/queue/state')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data).toHaveProperty('current');
                expect(res.body.data).toHaveProperty('next');
                expect(res.body.data).toHaveProperty('total');
                expect(res.body.data).toHaveProperty('averageTime');
                expect(res.body.data).toHaveProperty('estimatedWait');
                expect(Array.isArray(res.body.data.next)).toBe(true);
            });
        });
        it('should get public queue state', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .get(`/queue/public-state/${userId}`)
                .expect(200)
                .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data).toHaveProperty('current');
                expect(res.body.data).toHaveProperty('next');
                expect(res.body.data).toHaveProperty('total');
                expect(res.body.data).toHaveProperty('averageTime');
                expect(res.body.data).toHaveProperty('estimatedWait');
                expect(Array.isArray(res.body.data.next)).toBe(true);
            });
        });
        it('should call next ticket', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/tickets')
                .set('Authorization', `Bearer ${accessToken}`);
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/queue/call-next')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201)
                .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data).toHaveProperty('current');
                expect(res.body.data).toHaveProperty('next');
                expect(res.body.data).toHaveProperty('total');
                expect(res.body.data).toHaveProperty('averageTime');
                expect(res.body.data).toHaveProperty('estimatedWait');
            });
        });
        it('should finish current ticket', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/tickets')
                .set('Authorization', `Bearer ${accessToken}`);
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/queue/call-next')
                .set('Authorization', `Bearer ${accessToken}`);
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/queue/finish')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201)
                .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data).toHaveProperty('current');
                expect(res.body.data).toHaveProperty('next');
                expect(res.body.data).toHaveProperty('total');
                expect(res.body.data).toHaveProperty('averageTime');
                expect(res.body.data).toHaveProperty('estimatedWait');
            });
        });
        it('should get ticket position', async () => {
            const createResponse = await (0, supertest_1.default)(app.getHttpServer())
                .post('/tickets')
                .set('Authorization', `Bearer ${accessToken}`);
            const ticketCode = createResponse.body.data.code;
            return (0, supertest_1.default)(app.getHttpServer())
                .get(`/queue/my-position/${ticketCode}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
                .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data).toHaveProperty('position');
                expect(res.body.data).toHaveProperty('estimatedWait');
                expect(typeof res.body.data.position).toBe('number');
                expect(typeof res.body.data.estimatedWait).toBe('number');
            });
        });
    });
    describe('Health Check', () => {
        it('should return health status', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .get('/health')
                .expect(200)
                .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data).toHaveProperty('status', 'ok');
                expect(res.body.data).toHaveProperty('timestamp');
                expect(res.body.data).toHaveProperty('uptime');
                expect(res.body.data).toHaveProperty('version', '1.0.0');
                expect(typeof res.body.data.timestamp).toBe('string');
                expect(typeof res.body.data.uptime).toBe('number');
            });
        });
    });
    describe('App Controller', () => {
        it('/ (GET)', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .get('/')
                .expect(200)
                .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.data).toBe('Hello World!');
                expect(res.body).toHaveProperty('timestamp');
                expect(typeof res.body.timestamp).toBe('string');
            });
        });
    });
});
//# sourceMappingURL=app.e2e-spec.js.map