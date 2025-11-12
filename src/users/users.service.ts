// src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './schemas/dto/create-user.dto';
import { UpdateUserDto } from './schemas/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Consumir API externa GET /api/users/public/:id
   * Usa baseURL del HttpModule (configurada en UsersModule) o de env.
   */
  async getPublicUserById(id: string): Promise<any> {
    // Si definiste baseURL en HttpModule, basta con ruta relativa:
    const url = `/api/users/public/${id}`;

    const { data } = await firstValueFrom(this.http.get(url));
    return data;
  }

  // ---- CRUD local en MongoDB ----

  async create(dto: CreateUserDto): Promise<User> {
    // Evitar duplicados por email
    const exists = await this.userModel.findOne({ email: dto.email }).lean();
    if (exists) {
      throw new ConflictException('El email ya está registrado');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    const created = await this.userModel.create({
      ...dto,
      email: dto.email.toLowerCase().trim(),
      password: hash,
      isActive: true,
    });

    return created.toJSON() as any;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().lean();
    // lean() ya quita getters/setters; si necesitas toJSON, quita lean()
    return users as any;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).lean();
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user as any;
  }

  async findByEmail(email: string): Promise<User | null> {
    return (await this.userModel.findOne({ email: email.toLowerCase().trim() }).lean()) as any;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const update: Partial<User> = { ...dto };

    if (dto.email) {
      update.email = dto.email.toLowerCase().trim();
      const duplicate = await this.userModel.findOne({
        _id: { $ne: id },
        email: update.email,
      }).lean();
      if (duplicate) {
        throw new ConflictException('El email ya está en uso por otro usuario');
      }
    }

    if (dto.password) {
      update.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.userModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return updated.toJSON() as any;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }
}
