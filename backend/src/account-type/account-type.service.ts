import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountTypeDto } from './dto/create-account-type.dto';
import { UpdateAccountTypeDto } from './dto/update-account-type.dto';

@Injectable()
export class AccountTypeService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return await this.prisma.accountType.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const type = await this.prisma.accountType.findUnique({ where: { id } });
    if (!type || type.userId !== userId)
      throw new NotFoundException('Account type not found');
    return type;
  }

  async create(userId: string, dto: CreateAccountTypeDto) {
    return await this.prisma.accountType.create({
      data: { ...dto, userId },
    });
  }

  async update(userId: string, id: string, dto: UpdateAccountTypeDto) {
    await this.findOne(userId, id);
    return await this.prisma.accountType.update({
      where: { id },
      data: { ...dto },
    });
  }

  async softDelete(userId: string, id: string) {
    await this.findOne(userId, id);
    return await this.prisma.accountType.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
