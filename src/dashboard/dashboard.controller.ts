import { Controller, Get, Req, UseGuards, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService, private readonly prisma: PrismaService) { }

    @UseGuards(JwtAuthGuard)
    @Get('stats')
    getDashboardStats(@Req() req) {
        const userId = req.user.id;
        return this.dashboardService.getDashboardStats(userId);
    }

    @Get('loyers-mensuels')
    async getLoyersMensuels(@Query('year') year = new Date().getFullYear()) {
        const parsedYear = parseInt(year.toString(), 10);
        return this.dashboardService.getLoyersMensuels(parsedYear);
    }

    @UseGuards(JwtAuthGuard)
    @Get('dashboard-occupation')
    async getOccupationData(@Req() req: any) {
        const user = await this.prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                biens: true,
                baux: true
            }
        });

        return {
            biens: user?.biens,
            baux: user?.baux
        };
    }
}
