// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('FilaPro API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);

    await app.init();
  });

  beforeEach(async () => {
    await prisma.ticket.deleteMany();
    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    await prisma.ticket.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Authentication', () => {
    it('register user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('login user', async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123',
      });

      const res = await request(app.getHttpServer()).post('/auth/login').send({
        username: 'testuser2',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body.data.access_token).toBeDefined();
    });
  });

  describe('Queue', () => {
    let token: string;
    let userId: string;

    beforeEach(async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        username: 'queueuser',
        email: 'queue@example.com',
        password: 'password123',
      });

      const login = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'queueuser',
          password: 'password123',
        });

      token = login.body.data.access_token;
      userId = login.body.data.user.id;
    });

    it('create ticket', async () => {
      const res = await request(app.getHttpServer())
        .post('/tickets')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(201);
      expect(res.body.data.code).toBeDefined();
    });

    it('get public queue', async () => {
      const res = await request(app.getHttpServer()).get(
        `/queue/public-state/${userId}`,
      );

      expect(res.status).toBe(200);
      expect(res.body.data.total).toBeDefined();
    });
  });

  describe('Health', () => {
    it('health check', async () => {
      const res = await request(app.getHttpServer()).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('ok');
    });
  });
});
