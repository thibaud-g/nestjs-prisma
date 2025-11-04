import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';

type ArticleWithAuthor = Prisma.ArticleGetPayload<{ include: { author: true } }>;

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  create(createArticleDto: CreateArticleDto): Promise<ArticleWithAuthor> {
    return this.prisma.article.create({
      data: createArticleDto,
      include: { author: true },
    });
  }

  findAll(): Promise<ArticleWithAuthor[]> {
    return this.prisma.article.findMany({
      where: {
        published: true,
      },
      include: { author: true },
    });
  }

  findDrafts(): Promise<ArticleWithAuthor[]> {
    return this.prisma.article.findMany({
      where: {
        published: false,
      },
      include: { author: true },
    });
  }

  async findOne(id: number): Promise<ArticleWithAuthor> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    return article;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleWithAuthor> {
    try {
      return await this.prisma.article.update({
        where: { id },
        data: updateArticleDto,
        include: { author: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Article with ID ${id} not found`);
      }

      throw error;
    }
  }

  async remove(id: number): Promise<ArticleWithAuthor> {
    try {
      return await this.prisma.article.delete({
        where: { id },
        include: { author: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Article with ID ${id} not found`);
      }

      throw error;
    }
  }
}
