import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: createUserDto,
    });
    // Seed default account types
    await this.prisma.accountType.createMany({
      data: [
        { name: 'Cash', userId: user.id },
        { name: 'Bank', userId: user.id },
        { name: 'Credit', userId: user.id },
      ],
    });
    // Seed default category types
    await this.prisma.categoryType.createMany({
      data: [
        { name: 'Income', userId: user.id, isSystem: true },
        { name: 'Expense', userId: user.id, isSystem: true },
        { name: 'Transfer', userId: user.id, isSystem: true },
        { name: 'Gave Debt', userId: user.id, isSystem: true },
        { name: 'Took Debt', userId: user.id, isSystem: true },
        { name: 'Repay Debt', userId: user.id, isSystem: true },
      ],
    });
    return user;
  }
}
