import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    return this.prisma.profile.create({
      data: {
        ...createProfileDto,
        userId: userId, // Associate with the current user
      },
    });
  }

  async findAll(userId: string): Promise<Profile[]> {
    return this.prisma.profile.findMany({
      where: { userId }, // Filter by user ID
      orderBy: { createdAt: 'asc' }, // Optional: order by creation date
    });
  }

  async findOne(userId: string, id: string): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile || profile.userId !== userId) {
      // Check if found and belongs to the current user
      throw new NotFoundException(`Profile with ID "${id}" not found`);
    }
    return profile;
  }

  async update(
    userId: string,
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    // First, verify the profile exists and belongs to the user
    await this.findOne(userId, id);

    return this.prisma.profile.update({
      where: { id }, // No need to check userId here again due to findOne check
      data: updateProfileDto,
    });
  }

  async remove(userId: string, id: string): Promise<Profile> {
    // First, verify the profile exists and belongs to the user
    await this.findOne(userId, id);

    // Consider implications: deleting a profile might require handling related transactions.
    // For MVP, we just delete the profile.
    // TODO: Add logic to handle/prevent deletion if profile has associated transactions?
    return this.prisma.profile.delete({
      where: { id },
    });
  }
}
