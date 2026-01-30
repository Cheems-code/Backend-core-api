import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { SecurityLogService } from '../../security/security-log.service';

@Catch(ForbiddenException, UnauthorizedException)
export class SecurityExceptionFilter implements ExceptionFilter {
  constructor(private securityLog: SecurityLogService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    this.securityLog.log({
      type: exception instanceof ForbiddenException ? 'FORBIDDEN_ACCESS' : 'UNAUTHORIZED_ACCESS',
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    });

    throw exception;
  }
}
