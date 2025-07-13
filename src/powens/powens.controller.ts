import {
    Controller,
    Post,
    Get,
    Query,
    Req,
    Res,
    UseGuards,
    Body
} from '@nestjs/common';
import { PowensService } from './powens.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';
import { Public } from 'src/auth/auth.decorators';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { HttpCode, HttpStatus } from '@nestjs/common';

@Controller('api/powens')
@UseGuards(JwtAuthGuard)
export class PowensController {
    constructor(private readonly powensService: PowensService, private readonly prisma: PrismaService) { }

    // 1. Crée ou récupère le jeton Powens pour l’utilisateur connecté
    @Post('init-user')
    async initUser(@Req() req) {
        const userId = req.user.id; // accessible car injecté par JwtStrategy
        const authToken = await this.powensService.createAuthTokenForUser(userId);
        return { authToken };
    }

    // 2. Génère le code temporaire pour la WebView
    @Get('generate-temp-code')
    async getTempCode(@Req() req) {
        const userId = req.user.id;
        const code = await this.powensService.generateTemporaryCode(userId);
        return { code };
    }

    // 3. Callback après WebView Powens → enregistre connection_id
    @Get('callback')
    @Public()
    async powensCallback(
        @Query('connection_id') connectionId: string,
        @Res() res: Response,
    ) {
        if (!connectionId) {
            return res.status(400).send('Paramètre connection_id manquant.');
        }

        // Redirige vers le frontend Angular avec le paramètre dans l'URL
        const redirectUrl = `http://localhost:4200/bank-success?connection_id=${connectionId}`;

        return res.redirect(redirectUrl);
    }



    @Get('accounts')
    @UseGuards(JwtAuthGuard)
    async getAccounts(@Req() req) {
        const userId = req.user.id;
        return this.powensService.getUserAccounts(userId);
    }
    @Post('synchronize')
    @HttpCode(HttpStatus.OK)
    async synchronize(@Req() req: any) {
        const userId = req.user?.id;
        return await this.powensService.synchronizeConnection(userId);
    }

    @Get('detect-paiements')
    @HttpCode(HttpStatus.OK)

    async detectPaiements(@Req() req: any) {

        const userId = req.user?.id;
        if (!userId) {
            throw new Error('Utilisateur non authentifié');
        }

        const result = await this.powensService.detectAndStorePaiements(userId);
        return result;
    }


    @Post('save-connection')
    @HttpCode(HttpStatus.OK)
    async saveConnection(@Req() req: any, @Body('connectionId') connectionId: string) {
        const userId = req.user?.id;
        if (!userId) throw new UnauthorizedException();

        if (!connectionId) throw new Error('connectionId manquant');

        await this.powensService.storeConnectionId(userId, connectionId);
        return { status: 'ok', message: 'Connexion bancaire enregistrée' };
    }

}   