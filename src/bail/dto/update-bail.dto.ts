import { PartialType } from '@nestjs/mapped-types';
import { CreateBailDto } from './create-bail.dto';

export class UpdateBailDto extends PartialType(CreateBailDto) { }
