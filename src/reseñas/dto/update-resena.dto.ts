import { PartialType } from '@nestjs/mapped-types';
import { CreateResenaDto } from './create-resena.dto';

/** Permite actualizar calificacion/comentario (id_* no suele cambiar) */
export class UpdateResenaDto extends PartialType(CreateResenaDto) {}
