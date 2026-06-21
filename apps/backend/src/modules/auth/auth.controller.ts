import { Request, Response } from 'express';
import { z } from 'zod';
import * as authService from './auth.service';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const login = async (req: Request, res: Response) => {
  try {
    const parsedData = loginSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({ 
        success: false, 
        error: parsedData.error.issues.map((err) => err.message).join(', ') 
      });
    }

    const { email, password } = parsedData.data;

    const result = await authService.loginAdmin(email, password);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message || 'Authentication failed',
    });
  }
};
