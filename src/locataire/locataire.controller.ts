import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    ParseIntPipe,
} from '@nestjs/common';
import { LocataireService } from './locataire.service';
import { CreateLocataireDto } from './dto/create-locataire.dto';
import { UpdateLocataireDto } from './dto/update-locataire.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('locataires')
export class LocataireController {
    constructor(private readonly locataireService: LocataireService) { }

    @Post()
    create(@Body() dto: CreateLocataireDto, @Request() req) {
        return this.locataireService.create(req.user.id, dto);
    }

    @Get()
    findAll(@Request() req) {
        return this.locataireService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.locataireService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLocataireDto, @Request() req) {
        return this.locataireService.update(id, req.user.id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.locataireService.remove(id, req.user.id);
    }
}
