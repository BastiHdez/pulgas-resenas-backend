import { IsInt, Min, Max, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';

export class RateOnlyDto {
  @IsNumberString() productId!: string;     // viene por ruta pero lo dejo por si lo pasas en body
  @IsInt() idComprador!: number;
  @IsInt() idVendedor!: number;

  @IsInt() @Min(1) @Max(5)
  puntuacion!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comentario?: string; // opcional
  @IsString()
  @MaxLength(100)
  nombreComprador!: string;
}
