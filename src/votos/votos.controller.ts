import { Controller, Post, Param, Body } from '@nestjs/common';
import { VotosService } from './votos.service';
import { VoteDto } from './dto/vote.dto';

@Controller('ratings/comments')
export class VotosController {
  constructor(private readonly service: VotosService) {}

  @Post(':idResena/vote')
  vote(@Param('idResena') idResena: string, @Body() dto: VoteDto) {
    return this.service.votar(idResena, dto.idUsuario, dto.voto);
  }
}
