import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAiRequestLogDto } from './dto/ai-request-log.dto';
import { AIRequestLog } from '@prisma/client';

@Injectable()
export class AiRequestLogService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createDto: CreateAiRequestLogDto,
  ): Promise<AIRequestLog> {
    return this.prisma.aIRequestLog.create({
      data: {
        ...createDto,
        userId: userId,
      },
    });
  }

  async findAll(userId: string): Promise<AIRequestLog[]> {
    return this.prisma.aIRequestLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string): Promise<AIRequestLog> {
    const log = await this.prisma.aIRequestLog.findUnique({
      where: { id },
    });

    if (!log) {
      throw new NotFoundException(`AI Request Log with ID "${id}" not found`);
    }
    if (log.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this log',
      );
    }
    return log;
  }

  // No update or remove methods for MVP
}
