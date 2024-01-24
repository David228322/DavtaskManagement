import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import {UpdateTaskStatusDto} from "./dto/update-task-status.dto";

@Controller('tasks')
export class TasksController {
  constructor(private readonly _tasksService: TasksService) {}

  // @Get()
  // getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
  //   if (Object.keys(filterDto).length) {
  //     return this._tasksService.getTasksByFilters(filterDto);
  //   }
  //
  //   return this._tasksService.getAllTasks();
  // }
  //
  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return await this._tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() task: CreateTaskDto): Promise<Task> {
    return this._tasksService.createTask(task);
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
