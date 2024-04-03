import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    PrismaModule,
    ArticlesModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot(),
    ProjectsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
