import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto, UpdateGoalDto } from './dto/goal.dto';
import { Goal } from '@prisma/client';

@Injectable()
export class GoalService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createGoalDto: CreateGoalDto): Promise<Goal> {
    return this.prisma.goal.create({
      data: {
        ...createGoalDto,
        userId: userId,
        saved: 0, // Ensure saved starts at 0
      },
    });
  }

  async findAll(userId: string): Promise<Goal[]> {
    return this.prisma.goal.findMany({
      where: { userId },
      orderBy: { deadline: 'asc' }, // Order by deadline
    });
  }

  async findOne(userId: string, id: string): Promise<Goal> {
    const goal = await this.prisma.goal.findUnique({
      where: { id },
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID "${id}" not found`);
    }
    if (goal.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this goal',
      );
    }
    return goal;
  }

  async update(
    userId: string,
    id: string,
    updateGoalDto: UpdateGoalDto,
  ): Promise<Goal> {
    await this.findOne(userId, id); // Verify ownership

    return this.prisma.goal.update({
      where: { id },
      data: updateGoalDto,
    });
  }

  async remove(userId: string, id: string): Promise<Goal> {
    await this.findOne(userId, id); // Verify ownership

    return this.prisma.goal.delete({
      where: { id },
    });
  }
}
