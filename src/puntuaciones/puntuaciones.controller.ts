import { Controller, Get, Post, Param, Body, Query, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { PuntuacionesService } from './puntuaciones.service';
import { CreatePuntuacionDto } from './dto/create-puntuacion.dto';
import { UpdatePuntuacionDto } from './dto/update-puntuacion.dto';
import { QueryPuntuacionesDto } from './dto/query-puntuaciones.dto';

/**
 * Rutas públicas para puntuaciones directas a vendedores.
 * Colección: /api/v1/vendedores/:vendedorId/puntuaciones
 */
@Controller('api/v1/vendedores/:vendedorId/puntuaciones')
export class PuntuacionesController {
  constructor(private readonly service: PuntuacionesService) {}

  @Get()
  listar(
    @Param('vendedorId', ParseIntPipe) vendedorId: number,
    @Query() query: QueryPuntuacionesDto,
  ) {
    return this.service.listarPorVendedor(vendedorId, query);
  }

  @Post()
  crear(
    @Param('vendedorId', ParseIntPipe) vendedorId: number,
    @Body() dto: CreatePuntuacionDto,
  ) {
    return this.service.crear(vendedorId, dto);
  }

  // Opcionales sobre un id concreto
  @Patch(':id_puntuacion')
  actualizar(
    @Param('vendedorId', ParseIntPipe) vendedorId: number,
    @Param('id_puntuacion', ParseIntPipe) id_puntuacion: number,
    @Body() dto: UpdatePuntuacionDto,
  ) {
    return this.service.actualizar(vendedorId, id_puntuacion, dto);
  }

  @Delete(':id_puntuacion')
  eliminar(
    @Param('vendedorId', ParseIntPipe) vendedorId: number,
    @Param('id_puntuacion', ParseIntPipe) id_puntuacion: number,
  ) {
    return this.service.eliminar(vendedorId, id_puntuacion);
  }

  /**
   * Agregado útil: promedio y conteo de puntuaciones del vendedor.
   * /api/v1/vendedores/:vendedorId/puntuaciones/rating
   */
  @Get('rating')
  rating(@Param('vendedorId', ParseIntPipe) vendedorId: number) {
    return this.service.obtenerRating(vendedorId);
  }
}
