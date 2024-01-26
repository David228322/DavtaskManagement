import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private _tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this._tasksRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this._tasksRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with the id ${id} was not found`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this._tasksRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(id: string, taskStatus: TaskStatus): Promise<Task> {
    const taskToUpdate = await this.getTaskById(id);
    taskToUpdate.status = taskStatus;

    return await this._tasksRepository.save(taskToUpdate);
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this._tasksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with the id ${id} was not found`);
    }
  }
}
