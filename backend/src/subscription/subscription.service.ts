import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './dto/subscription.dto';
import { Subscription } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    return this.prisma.subscription.create({
      data: {
        ...createSubscriptionDto,
        userId: userId,
      },
    });
  }

  async findAll(userId: string): Promise<Subscription[]> {
    // Typically a user only has one subscription, but findAll might be useful
    return this.prisma.subscription.findMany({
      where: { userId },
      orderBy: { expiresAt: 'desc' }, // Or other relevant field
    });
  }

  async findOne(userId: string, id: string): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID "${id}" not found`);
    }
    if (subscription.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this subscription',
      );
    }
    return subscription;
  }

  // Find the *active* subscription for a user (more common use case)
  async findActiveForUser(userId: string): Promise<Subscription | null> {
    return this.prisma.subscription.findFirst({
      where: {
        userId: userId,
        status: 'active', // Or potentially 'trial'
      },
    });
  }

  async update(
    userId: string,
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    await this.findOne(userId, id); // Verify ownership

    return this.prisma.subscription.update({
      where: { id },
      data: updateSubscriptionDto,
    });
  }

  async remove(userId: string, id: string): Promise<Subscription> {
    await this.findOne(userId, id); // Verify ownership

    return this.prisma.subscription.delete({
      where: { id },
    });
  }
}
