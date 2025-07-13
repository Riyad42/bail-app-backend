import {
    Controller, Post, Get, Patch, Delete, Param, Body, ParseIntPipe
} from '@nestjs/common';
import { PaiementLoyerService } from './paiement-loyer.service';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';

@Controller('paiements-loyer')
export class PaiementLoyerController {
    constructor(private readonly paiementService: PaiementLoyerService) { }

    @Post(':locataireId/paiements')
    createPaiement(
        @Param('locataireId', ParseIntPipe) locataireId: number,
        @Body() dto: CreatePaiementDto,
    ) {
        return this.paiementService.create(locataireId, dto);
    }


    @Get('bail/:bailId')
    findAllForBail(@Param('bailId', ParseIntPipe) bailId: number) {
        return this.paiementService.findAllForBail(bailId);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePaiementDto) {
        return this.paiementService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.paiementService.remove(id);
    }

    @Get('locataire/:locataireId')
    findAllForLocataire(@Param('locataireId', ParseIntPipe) locataireId: number) {
        return this.paiementService.findAllForLocataire(locataireId);
    }

    @Get('bailleur/:bailleurId')
    findAllForBailleur(@Param('bailleurId', ParseIntPipe) bailleurId: number) {
        return this.paiementService.findAllForBailleur(bailleurId);
    }



}
