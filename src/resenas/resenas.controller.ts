import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { ResenasService } from './resenas.service';
import { RateOnlyDto } from './dto/rate-only.dto';
import { CreateResenaDto } from './dto/create-resena.dto';

@Controller('ratings')
export class ResenasController {
  constructor(private readonly service: ResenasService) {}

  /** Promedio (y cantidad) por producto */
  @Get(':productId/average')
  average(@Param('productId') productId: string) {
    return this.service.average(Number(productId));
  }

  /** Listar reseñas del producto (con conteo de votos) + paginación (?limit, ?offset) */
  @Get(':productId/comments')
  list(
    @Param('productId') productId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.service.listByProduct(Number(productId), {
      limit: Math.min(Number(limit || 10), 50), // tope 50 por seguridad
      offset: Math.max(Number(offset || 0), 0),
    });
  }

  /** Puntuar (comentario opcional). También sirve como "agregar reseña" */
  @Post(':productId')
  rate(
    @Param('productId') productId: string,
    @Body() dto: RateOnlyDto,
  ) {
    return this.service.rateProduct(Number(productId), dto);
  }

  /** Alias semántico: crear reseña bajo /comments (idéntico a /:productId) */
  @Post(':productId/comments')
  create(
    @Param('productId') productId: string,
    @Body() dto: CreateResenaDto,
  ) {
    return this.service.createResena(Number(productId), dto);
  }

  /** Eliminar reseña (solo autor) */
  @Delete('comments/:idResena')
  deleteComment(
    @Param('idResena') idResena: string,
    @Body('idComprador') idComprador: number,
  ) {
    return this.service.deleteResena(idResena, Number(idComprador));
  }
}
