import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(email, password);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      const user = await this.authService.login(email, password);
      if (!user) {
        return { message: 'Invalid credentials' };
      }
      return { message: 'Login successful', user };
    } catch (error) {
      return { message: 'An error occurred', error: error.message };
    }
  }

  @Post('protected')
  @UseGuards(JwtAuthGuard)
  async protectedRoute() {
    return { message: 'Protected route accessed' };
  }
}
