import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, Project } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prismaService: PrismaService) {}

  create(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.prismaService.project.create({
      data: createProjectDto,
    });
  }

  findAll(): Promise<Project[]> {
    return this.prismaService.project.findMany();
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.prismaService.project.findUnique({
      where: {
        id,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    try {
      return await this.prismaService.project.update({
        where: {
          id,
        },
        data: updateProjectDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      throw error;
    }
  }

  async remove(id: number): Promise<Project> {
    try {
      return await this.prismaService.project.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      throw error;
    }
  }
}
