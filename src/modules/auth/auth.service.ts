import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';

import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Registro de usuario
  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        // role se asigna por default en Prisma
      },
    });

    return this.issueTokens(user);
  }

  // Login de usuario
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(user);
  }

  //Nuevo metodo para generar token
  private async issueTokens(user: {
      id: string;
      email: string;
      role: Role;
  }) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();

    // Guardamos refresh token hasheado
    await this.saveRefreshToken(
        user.id,
        refreshToken,
    );

    return {
        access_token: accessToken,
        refresh_token: refreshToken,
    };
  }

  //Nuevo access token de vida corta
  private generateAccessToken(user: {
    id: string;
    email: string;
    role: Role;
  }): string {
    return this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: '15m',
      },
    );
  }

  //Nuevo refresh token de vida larga
  private generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  //Guardar refresh token hasheado en la DB
  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
  ) {
    const hashedToken = this.hashToken(refreshToken);

    await this.prisma.refreshToken.create({
      data: {
        token: hashedToken,
        userId,
        expiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ),
      },
    });
  }

  //Hashing del token
  private hashToken(token: string): string {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
  }

  //Refrescar tokens
  async refreshTokens(refreshToken: string) {
    const hashedToken = this.hashToken(refreshToken);

    const storedToken =
      await this.prisma.refreshToken.findFirst({
        where: { 
          token: hashedToken,
          revoked: false,
         },
        include: { user: true },
      });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    //Revocamos el token usado
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {revoked: true }
    });

    // Emitimos nuevos tokens
    return this.issueTokens(storedToken.user);
  }

  //Logout de usuario
  async logout(refreshToken: string) {
  const hashedToken = this.hashToken(refreshToken);

  await this.prisma.refreshToken.updateMany({
    where: {
      token: hashedToken,
      revoked: false,
    },
    data: {
      revoked: true,
    },
  });

  return { message: 'Logged out successfully' };
}


}
