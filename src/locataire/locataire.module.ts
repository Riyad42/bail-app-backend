import { Module } from '@nestjs/common';
import { LocataireService } from './locataire.service';
import { LocataireController } from './locataire.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
    controllers: [LocataireController],
    providers: [LocataireService, PrismaService],
})
export class LocataireModule { }
