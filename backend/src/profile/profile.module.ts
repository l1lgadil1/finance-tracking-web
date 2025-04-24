import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
// No other module imports needed here as PrismaModule is global
// and AuthModule provides guards/decorators implicitly via @UseGuards/etc.

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService], // Export if needed by other modules later
})
export class ProfileModule {}
