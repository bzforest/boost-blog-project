import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const app = express();
const port = process.env.PORT || 4000;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Boost Blog API is running!' });
});


const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
