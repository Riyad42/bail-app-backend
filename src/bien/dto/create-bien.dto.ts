import { IsString, IsInt, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateBienDto {
  @IsString() titre: string;
  @IsString() adresse: string;
  @IsString() ville: string;
  @IsString() codePostal: string;
  @IsInt() superficie: number;
  @IsString() type: string;
  @IsBoolean() meuble: boolean;
  @IsNumber() loyerMensuel: number;

  @IsOptional() @IsNumber() chargesMensuelles?: number;
  @IsNumber() prixAchat: number;
  @IsOptional() @IsNumber() fraisNotaire?: number;
  @IsOptional() @IsNumber() fraisTravaux?: number;
  @IsOptional() @IsString() description?: string;
}
