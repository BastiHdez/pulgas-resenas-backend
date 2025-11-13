import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotoResena } from '../voto-resena.entity';
import { VotosService } from './votos.service';
import { VotosController } from './votos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VotoResena])],
  controllers: [VotosController],
  providers: [VotosService],
})
export class VotosModule {}
