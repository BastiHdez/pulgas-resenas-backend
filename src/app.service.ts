import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class UsersService {
  constructor(private readonly http: HttpService) {}

  // Llama a la API externa /api/users/public/:id
  async getPublicUserById(id: string): Promise<any> {
    try {
      const { data } = await firstValueFrom(
        this.http
          .get(`/api/users/public/${encodeURIComponent(id)}`)
          .pipe(
            catchError((err: AxiosError) => {
              throw err;
            }),
          ),
      );
      if (!data) throw new NotFoundException('Usuario no encontrado');
      return data;
    } catch (err: any) {
      if (err?.response?.status === 404) {
        throw new NotFoundException('Usuario no encontrado');
      }
      throw err;
    }
  }
}
