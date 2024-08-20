import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: { userId: userId },
    });

    return projects;
  }

  async create(userId: string, projectName: string) {
    const newProject = await this.prisma.project.create({
      data: {
        name: projectName,
        userId,
      },
    });
    return newProject;
  }
}
