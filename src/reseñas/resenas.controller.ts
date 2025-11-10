import { Controller, Get, Post, Param, Body, Query, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { QueryResenasDto } from './dto/query-resenas.dto';

/**
 * Rutas públicas para reseñas de productos.
 * Colección: /api/v1/productos/:productoId/resenas
 */
@Controller('api/v1/productos/:productoId/resenas')
export class ResenasController {
  constructor(private readonly service: ResenasService) {}

  @Get()
  listar(
    @Param('productoId', ParseIntPipe) productoId: number,
    @Query() query: QueryResenasDto,
  ) {
    return this.service.listarPorProducto(productoId, query);
  }

  @Post()
  crear(
    @Param('productoId', ParseIntPipe) productoId: number,
    @Body() dto: CreateResenaDto,
  ) {
    // fecha_creacion la define el servidor; id_resena es PK autogenerada
    return this.service.crear(productoId, dto);
  }

  // Endpoints opcionales sobre un id concreto
  @Patch(':id_resena')
  actualizar(
    @Param('productoId', ParseIntPipe) productoId: number,
    @Param('id_resena', ParseIntPipe) id_resena: number,
    @Body() dto: UpdateResenaDto,
  ) {
    return this.service.actualizar(productoId, id_resena, dto);
  }

  @Delete(':id_resena')
  eliminar(
    @Param('productoId', ParseIntPipe) productoId: number,
    @Param('id_resena', ParseIntPipe) id_resena: number,
  ) {
    return this.service.eliminar(productoId, id_resena);
  }
}
