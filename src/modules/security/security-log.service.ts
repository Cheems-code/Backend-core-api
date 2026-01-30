import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityLogService {
  log(event: {
    type: string;
    userId?: string;
    ip?: string;
    userAgent?: string;
    details?: any;
  }) {
    console.warn('SECURITY EVENT:', {
      timestamp: new Date().toISOString(),
      ...event,
    });
  }
}
