import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resena } from '../resena.entity';
import { VotoResena } from '../voto-resena.entity';
import { ResenasController } from './resenas.controller';
import { ResenasService } from './resenas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Resena, VotoResena])],
  controllers: [ResenasController],
  providers: [ResenasService],
  exports: [ResenasService],
})
export class ResenasModule {}
