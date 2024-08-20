import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(':userId')
  async getUserProjects(@Param('userId') userId: string) {
    try {
      return this.projectService.getAll(userId);
    } catch (err) {
      throw new NotFoundException();
    }
  }

  @Post()
  async createProject(
    @Body('userId') userId: string,
    @Body('projectName') projectName: string,
  ) {
    try {
      return this.projectService.create(userId, projectName);
    } catch (err) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
