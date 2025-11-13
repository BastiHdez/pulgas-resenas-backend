import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resena } from './resena.entity';
import { VotoResena } from './voto-resena.entity';
import { ResenasModule } from './resenas/resenas.module';
import { VotosModule } from './votos/votos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'ratings',
      password: process.env.DB_PASS || 'ratings',
      database: process.env.DB_NAME || 'resenaspulgas',
      entities: [Resena, VotoResena],
      synchronize: (process.env.DB_SYNC || 'false') === 'true',
    }),
    ResenasModule,
    VotosModule,
  ],
})
export class AppModule {}
