import { IsInt, IsIn } from 'class-validator';

export class VoteDto {
  @IsInt() idUsuario!: number;
  @IsIn(['up','down']) voto!: 'up'|'down';
}
