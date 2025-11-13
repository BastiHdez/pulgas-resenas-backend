// src/users/users.service.ts

import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { query } from '../config/db'; // ✅ Importamos la utilidad de PostgreSQL

// Define una interfaz de usuario básica para Type-Safety
// 🚨 CORRECCIÓN TS4053: Agregamos 'export' para que otros archivos puedan usar este tipo
export interface User { 
  id: number; 
  email: string;
  name: string;
  lastName: string; 
  password?: string;
  createdAt: string;
  // Añade todos los campos de tu tabla 'users'
}

// Puedes reutilizar estos DTOs, pero las clases User/UserDocument se eliminan
import { CreateUserDto } from './schemas/dto/create-user.dto';
import { UpdateUserDto } from './schemas/dto/update-user.dto';

@Injectable()
export class UsersService {
  // 🛑 La inyección de @InjectModel ya no es necesaria.

  /** ---------- Rutas PÚBLICAS (sin JWT) ---------- */

  // Proyección pública por ID
  async findPublicById(id: string): Promise<Omit<User, 'password'> | null> {
    const sql = `
      SELECT id, name, "lastName", avatar, bio, "createdAt" 
      FROM users 
      WHERE id = $1;
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  // Listado público básico (opcional)
  async listPublic(): Promise<Omit<User, 'password'>[]> {
    const sql = `
      SELECT id, name, "lastName", avatar, bio, "createdAt" 
      FROM users 
      LIMIT 50;
    `;
    const result = await query(sql);
    return result.rows;
  }

  /** ---------- CRUD protegido / uso interno ---------- */

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 1. ¿email ya registrado?
    const existingUserResult = await query('SELECT id FROM users WHERE email = $1', [createUserDto.email]);
    if (existingUserResult.rows.length > 0) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // 2. Hash de contraseña
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // 3. Crear usuario
    const sql = `
      INSERT INTO users (email, password, name, last_name) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, email, name, last_name, "createdAt";
    `;
    
    // El array debe coincidir con el orden de la sentencia SQL
    const result = await query(sql, [
      createUserDto.email,     // $1: Email
      hashedPassword,          // $2: Password (Hashed)
      createUserDto.name,      // $3: Name
      createUserDto.lastName,  // $4: Last Name
    ]);

    return result.rows[0];
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const result = await query('SELECT id, email, name, "lastName", "createdAt" FROM users');
    return result.rows;
  }
  
  async findByEmail(email: string): Promise<User | undefined> {
    const sql = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
    const result = await query(sql, [email]);
    return result.rows[0];
  }
  
  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const sql = 'SELECT id, email, name, "lastName", "createdAt" FROM users WHERE id = $1';
    const result = await query(sql, [id]);
    const user = result.rows[0];
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }
  
  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    let fields = [];
    let params = [];
    let counter = 1;
    
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    
    for (const key in updateUserDto) {
        if (updateUserDto[key] !== undefined) {
            const column = key === 'lastName' ? '"last_name"' : `"${key}"`;
            fields.push(`${column} = $${counter}`);
            params.push(updateUserDto[key]);
            counter++;
        }
    }

    if (params.length === 0) {
        throw new NotFoundException(`No hay datos para actualizar.`);
    }

    params.push(id); 
    const sql = `
        UPDATE users 
        SET ${fields.join(', ')} 
        WHERE id = $${counter} 
        RETURNING id, email, name, "lastName", "createdAt";
    `;
    
    const result = await query(sql, params);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return result.rows[0];
  }

  async remove(id: string): Promise<void> {
    const sql = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await query(sql, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }
}