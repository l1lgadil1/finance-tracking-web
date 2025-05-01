import { ApiProperty } from '@nestjs/swagger';

export class CategoryTypeResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Category type name' })
  name: string;

  @ApiProperty({ description: 'User ID associated with this category type' })
  userId: string;

  @ApiProperty({
    description:
      'Indicates if this is a system category type that cannot be deleted',
    default: false,
  })
  isSystem: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
