import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'resena' })
@Index('uq_resena_producto_comprador', ['idProducto', 'idComprador'], { unique: true })
export class Resena {
  @PrimaryGeneratedColumn('uuid', { name: 'id_resena' })
  idResena!: string;

  @Column('bigint', { name: 'id_producto' })
  idProducto!: number;

  @Column('bigint', { name: 'id_comprador' })
  idComprador!: number;

  @Column('bigint', { name: 'id_vendedor' })
  idVendedor!: number;

  @Column('text', { name: 'comentario', nullable: true })
  comentario!: string | null;

  @Column('int', { name: 'puntuacion' })
  puntuacion!: number; // 1..5

  @Column('timestamp', { name: 'fecha_resena', default: () => 'CURRENT_DATE' })
  fechaResena!: Date;

  @Column('varchar', { name: 'nombre_comprador', length: 100 })
  nombreComprador!: string;
}
