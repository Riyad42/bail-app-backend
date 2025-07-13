import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBailDto {
    @IsDateString() dateDebut: string;
    @IsDateString() dateFin: string;
    @IsNumber() montant: number;

    @IsOptional() @IsNumber() chargesMensuelles?: number;
    @IsOptional() @IsString() typeBail?: string;
    @IsOptional() @IsInt() paiementLe?: number;
    @IsOptional() @IsNumber() caution?: number;

    @IsInt() bienId: number;
    @IsInt() locataireId: number;
    @IsOptional()
    @IsString()
    documentUrl?: string | null;


}
