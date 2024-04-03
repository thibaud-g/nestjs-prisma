import { ApiProperty } from '@nestjs/swagger';
import { Project } from '@prisma/client';

export class ProjectEntity implements Project {
  constructor(partial: Partial<ProjectEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isWorkInProgress: boolean;

  @ApiProperty()
  stack: string[];

  @ApiProperty()
  url: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  imageUrl: string;
}
