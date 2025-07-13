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
import { BienService } from './bien.service';
import { CreateBienDto } from './dto/create-bien.dto';
import { UpdateBienDto } from './dto/update-bien.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // à adapter selon ton projet

@UseGuards(JwtAuthGuard)
@Controller('biens')
export class BienController {
    constructor(private readonly bienService: BienService) { }

    @Post()
    create(@Body() createBienDto: CreateBienDto, @Request() req) {
        return this.bienService.create(req.user.id, createBienDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.bienService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.bienService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBienDto: UpdateBienDto,
        @Request() req,
    ) {
        return this.bienService.update(id, req.user.id, updateBienDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.bienService.remove(id, req.user.id);
    }
}
