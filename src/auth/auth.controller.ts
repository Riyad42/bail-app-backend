import { Body, Controller, Post, Get, Req, UseGuards, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() body: { name: string, email: string; password: string }) {
        return this.authService.register(body.name, body.email, body.password);
    }

    @Post('login')
    login(@Body() body: { email: string; password: string }) {
        return this.authService.login(body.email, body.password);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@Req() req) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Put('update-profile')
    async updateProfile(@Req() req: Request, @Body() body: any) {
        const userId = req['user'].id;
        return this.authService.updateProfile(userId, body);
    }
    @UseGuards(JwtAuthGuard)
    @Put('update-password')
    async updatePassword(@Req() req: Request, @Body() body: any) {
        const userId = req['user'].id;
        const { oldPassword, newPassword } = body;
        return this.authService.updatePassword(userId, oldPassword, newPassword);
    }



}
