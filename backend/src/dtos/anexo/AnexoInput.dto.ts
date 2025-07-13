import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateAnexoInputDto {
    @IsString()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsNotEmpty()
    nome_arquivo: string;

    @IsEnum(['image', 'document', 'video', 'audio'])
    tipo_arquivo: 'image' | 'document' | 'video' | 'audio';
}