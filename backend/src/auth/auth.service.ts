import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) { }

  async validateUser(email: string, pass: string) {
    if (!email || !pass) {
      return null;
    }
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user as any;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user._id, email: user.email, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };
  }

  async signup(dto: any) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new UnauthorizedException('Email already in use');
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({ ...dto, password: hashed });
    const payload = { sub: user._id, email: user.email, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };
  }
}
