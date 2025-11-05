// src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './schemas/dto/create-user.dto';
import { UpdateUserDto } from './schemas/dto/update-user.dto';


@Injectable()
export class UsersService {
   // Inyectamos HttpService para poder consumir APIs externas
  constructor(private readonly http:  ) {}

  /**
   * Obtiene un usuario público desde la API externa:
   *   GET /api/users/public/:id
   */
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

      if (!data) {
        throw new NotFoundException('Usuario no encontrado en la API externa');
      }

      return data;
    } catch (err: any) {
      // Si la API devuelve 404, lanzamos la excepción adecuada en NestJS:
      if (err?.response?.status === 404) {
        throw new NotFoundException('Usuario no encontrado en la API externa');
      }
      // Si es otro error, lo propagamos tal cual:
      throw err;
    }
  }
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // Verificar si el email ya existe
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Crear el nuevo usuario
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Si hay una nueva contraseña, la hasheamos
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }
}
