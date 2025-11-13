import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({ name: 'voto_resena' })
@Unique('voto_resena_id_resena_id_usuario_key', ['idResena', 'idUsuario'])
export class VotoResena {
  @PrimaryGeneratedColumn('uuid', { name: 'id_voto' })
  idVoto: string;

  @Column('uuid', { name: 'id_resena' })
  idResena: string;

  @Column('bigint', { name: 'id_usuario' })
  idUsuario: number;

  @Column('boolean', { name: 'voto' })
  voto: boolean; // true=👍, false=👎
}
