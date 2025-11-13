import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VotoResena } from '../voto-resena.entity';

@Injectable()
export class VotosService {
  constructor(@InjectRepository(VotoResena) private readonly repo: Repository<VotoResena>) {}

  async votar(idResena: string, idUsuario: number, vote: 'up'|'down') {
    const value = vote === 'up';
    const existing = await this.repo.findOne({ where: { idResena, idUsuario } });
    if (existing) {
      existing.voto = value;
      await this.repo.save(existing);
    } else {
      await this.repo.save(this.repo.create({ idResena, idUsuario, voto: value }));
    }
    return { status: 'ok' };
  }
}
