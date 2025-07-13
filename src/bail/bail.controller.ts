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
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { BailService } from './bail.service';
import { CreateBailDto } from './dto/create-bail.dto';
import { UpdateBailDto } from './dto/update-bail.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { extname } from 'path';


@UseGuards(JwtAuthGuard)
@Controller('baux')
export class BailController {
    constructor(private readonly bailService: BailService) { }

    @Post(':id/upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './upload',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `bail-${uniqueSuffix}${ext}`);
            },
        }),
    }))
    async uploadBailDocument(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.bailService.attachFileToBail(+id, file.filename);
    }


    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './upload',
            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname);
                const name = path.basename(file.originalname, ext).replace(/\s+/g, '-');
                cb(null, `${name}-${Date.now()}${ext}`);
            }
        })
    }))
    create(
        @Body() body: CreateBailDto,
        @UploadedFile() file: Express.Multer.File,
        @Request() req: any
    ) {
        const userId = req.user.id || 1;
        const bailData = {
            ...body,
            bienId: Number(body.bienId),
            locataireId: Number(body.locataireId),
            documentUrl: file ? `/upload/${file.filename}` : null,
        };

        return this.bailService.create(userId, bailData);
    }

    @Get()
    findAll(@Request() req) {
        return this.bailService.findAll(req.user.id);
    }


    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.bailService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBailDto, @Request() req) {
        return this.bailService.update(id, req.user.id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.bailService.remove(id, req.user.id);
    }
}
