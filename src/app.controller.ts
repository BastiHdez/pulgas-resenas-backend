import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/public/:id  -> consume la API externa y retorna el JSON
  @Get('public/:id')
  async getPublic(@Param('id') id: string) {
    return this.usersService.getPublicUserById(id);
  }
}
