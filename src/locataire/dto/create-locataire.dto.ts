import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateLocataireDto {
    @IsString() civilite: string;
    @IsString() prenom: string;
    @IsString() nom: string;
    @IsString() email: string;
    @IsString() tel: string;

    @IsOptional() @IsString() adresse?: string;
    @IsOptional() @IsDateString() dateNaissance?: string;
    @IsOptional() @IsString() typeLocataire?: string;
}
