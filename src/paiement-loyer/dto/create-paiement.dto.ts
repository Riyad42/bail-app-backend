import { IsInt, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePaiementDto {
    @IsInt()
    mois: number;

    @IsInt()
    annee: number;

    @IsString()
    statut: string;

    @IsNumber()
    montant: number;

    @IsOptional()
    datePaiement?: Date;

    @IsInt()
    bailId: number;
}
