import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

interface AdminVerifyOptions {
  requireEmail?: string;
  requireRole?: string;
}

export async function requireAdmin(
  options: AdminVerifyOptions = {}
): Promise<{
  isValid: boolean;
  response?: NextResponse;
  user?: any;
  error?: string;
}> {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return {
        isValid: false,
        response: NextResponse.json(
          {
            success: false,
            error: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
          { status: 401 }
        ),
        error: 'Not authenticated',
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== 'admin') {
      return {
        isValid: false,
        response: NextResponse.json(
          {
            success: false,
            error: 'FORBIDDEN',
            message: 'Admin access required',
          },
          { status: 403 }
        ),
        error: 'User is not an admin',
      };
    }

    if (options.requireEmail && user.email !== options.requireEmail) {
      return {
        isValid: false,
        response: NextResponse.json(
          {
            success: false,
            error: 'FORBIDDEN',
            message: 'Access denied',
          },
          { status: 403 }
        ),
        error: 'Email does not match required email',
      };
    }

    if (options.requireRole && user.role !== options.requireRole) {
      return {
        isValid: false,
        response: NextResponse.json(
          {
            success: false,
            error: 'FORBIDDEN',
            message: 'Insufficient permissions',
          },
          { status: 403 }
        ),
        error: 'Role does not match required role',
      };
    }

    return {
      isValid: true,
      user,
    };
  } catch (error) {
    console.error('Admin verification error:', error);
    return {
      isValid: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'INTERNAL_SERVER_ERROR',
          message: 'Verification failed',
        },
        { status: 500 }
      ),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function adminSuccess<T = any>(
  data: T,
  message: string = 'Success',
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

export function adminError(
  error: string,
  message: string = 'Error occurred',
  status: number = 400
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      message,
    },
    { status }
  );
}
