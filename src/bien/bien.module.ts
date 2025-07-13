import { Module } from '@nestjs/common';
import { BienService } from './bien.service';
import { BienController } from './bien.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
    controllers: [BienController],
    providers: [BienService, PrismaService],
})
export class BienModule { }
