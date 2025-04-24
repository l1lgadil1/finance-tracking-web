import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      // Use a fixed value of 10 for salt rounds
      const saltRounds = 10;
      console.log('Using fixed salt rounds:', saltRounds);

      // Generate the hash with proper error handling
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      console.log('Password successfully hashed');

      return this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
    } catch (error) {
      console.error('Error during password hashing:', error);
      throw error;
    }
  }

  // Add other user-related methods if needed
}
