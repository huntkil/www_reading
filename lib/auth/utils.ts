import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return { user: null, error: 'No token provided', status: 401 };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as jwt.JwtPayload;
    
    if (!decoded.userId) {
      return { user: null, error: 'Invalid token payload', status: 401 };
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true } 
    });

    if (!user) {
      return { user: null, error: 'User not found', status: 404 };
    }

    return { user, error: null, status: 200 };
  } catch {
    return { user: null, error: 'Invalid or expired token', status: 401 };
  }
} 