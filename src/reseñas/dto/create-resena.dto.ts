import { IsInt, Min, Max, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Tabla: resenaProducto
 * NO incluir id_resena ni fecha_creacion (los maneja el servidor/DB)
 */
export class CreateResenaDto {
  @Type(() => Number)
  @IsInt()
  id_comprador!: number;

  @Type(() => Number)
  @IsInt()
  id_vendedor!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  calificacion!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comentario?: string;
}
