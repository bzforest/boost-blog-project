import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
}
const JWT_EXPIRES_IN = '1d';

export const loginAdmin = async (email: string, password: string) => {
  // 1. Find Admin
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    throw new Error('Invalid credentials');
  }

  // 2. Compare password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // 3. Generate JWT
  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: 'ADMIN' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: admin.id,
      email: admin.email,
      role: 'ADMIN',
    },
  };
};
