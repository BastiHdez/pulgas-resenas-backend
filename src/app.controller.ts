import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/public/:id  -> consume la API externa y retorna el JSON
  @Get('public/:id')
  async getPublicUser(@Param('id') id: string) {
    const user = await this.usersService.findPublicById(id);
    if (!user) throw new NotFoundException('User not found');
    return user; // ya viene saneado
  }

  // (Opcional) lista pública básica
  @Public()
  @Get('public')
  listPublicUsers() {
    return this.usersService.listPublic();
  }
}
