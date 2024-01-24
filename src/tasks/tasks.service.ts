import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
      @InjectRepository(TasksRepository)
    private _tasksRepository: TasksRepository,
  ) {}

  // getAllTasks() {
  //   return this.tasks;
  // }
  //
  // getTasksByFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let result: Task[] = this.getAllTasks();
  //
  //   if (search) {
  //     result = result.filter(
  //       (task) =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }
  //
  //   console.log(filterDto.status);
  //   if (status) {
  //     result = result.filter((task) => task.status === status);
  //   }
  //
  //   return result;
  // }
  //
  async getTaskById(id: string): Promise<Task> {
    const task = await this._tasksRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with the id ${id} was not found`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this._tasksRepository.createTask(createTaskDto);
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
