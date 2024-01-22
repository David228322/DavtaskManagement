import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {Task, TaskStatus} from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";

@Controller('tasks')
export class TasksController {
  constructor(private readonly _tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this._tasksService.getTasksByFilters(filterDto);
    }

    return this._tasksService.getAllTasks();
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string) {
    return this._tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() task: CreateTaskDto): Task {
    return this._tasksService.createTask(task);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body('status') taskStatus: TaskStatus,
  ): Task {
    return this._tasksService.updateTask(id, taskStatus);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this._tasksService.deleteTask(id);
  }
}
