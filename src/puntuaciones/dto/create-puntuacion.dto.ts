import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Tabla: puntuacionVendedor
 * NO incluir id_puntuacion ni fecha_creacion (los maneja el servidor/DB)
 */
export class CreatePuntuacionDto {
  @Type(() => Number)
  @IsInt()
  id_comprador!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  puntuacion!: number;
}
