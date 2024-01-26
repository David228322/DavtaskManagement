import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { ConfigService } from '@nestjs/config';

@Controller('tasks')
export class TasksController {
  private logger = new Logger('TasksController', { timestamp: true });

  constructor(
    private readonly _tasksService: TasksService,
    private configService: ConfigService,
  ) {
    Logger.verbose(this.configService.get('HELLO'));
  }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    this.logger.verbose(
      `User is trynna to get task by filters: ${JSON.stringify(filterDto)}`,
    );
    return this._tasksService.getTasks(filterDto);
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return await this._tasksService.getTaskById(id);
  }

  @Post()
  createTask(
    @GetUser() user: User,
    @Body() task: CreateTaskDto,
  ): Promise<Task> {
    return this._tasksService.createTask(task, user);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this._tasksService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<void> {
    return this._tasksService.deleteTask(id);
  }
}
