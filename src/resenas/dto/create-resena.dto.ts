import { IsInt, Min, Max, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateResenaDto {
  @IsInt() idComprador!: number;
  @IsInt() idVendedor!: number;

  @IsInt() @Min(1) @Max(5)
  puntuacion!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comentario?: string;

  @IsString()
  @MaxLength(100)
  nombreComprador!: string;
}
