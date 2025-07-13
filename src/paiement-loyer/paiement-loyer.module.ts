import { Module } from '@nestjs/common';
import { PaiementLoyerService } from './paiement-loyer.service';
import { PaiementLoyerController } from './paiement-loyer.controller';
import { PrismaService } from 'src/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
    imports: [ScheduleModule.forRoot()],
    controllers: [PaiementLoyerController],
    providers: [PaiementLoyerService, PrismaService],
})
export class PaiementLoyerModule { }
