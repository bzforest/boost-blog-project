import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Initialize the Postgres Pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create the Prisma adapter for Postgres
const adapter = new PrismaPg(pool);

// Export a singleton PrismaClient instance to be used across the app
export const prisma = new PrismaClient({ adapter });
