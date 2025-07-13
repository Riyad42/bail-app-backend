import { Module } from '@nestjs/common';
import { PowensService } from './powens.service';
import { PowensController } from './powens.controller';
import { PrismaService } from 'src/prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    controllers: [PowensController],
    providers: [PowensService, PrismaService],
    imports: [HttpModule],
    exports: [PowensService]
})
export class PowensModule { }
