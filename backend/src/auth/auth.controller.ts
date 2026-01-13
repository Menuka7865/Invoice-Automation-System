import { Body, Controller, Post, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  signup(@Body() body: any) {
    return this.authService.signup(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    const valid = await this.authService.validateUser(body.email, body.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(valid);
  }

  @Post('logout')
  logout() {
    return { success: true, message: 'Logged out successfully' };
  }
}
