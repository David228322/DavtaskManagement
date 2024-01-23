import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {filter} from "rxjs";

@Injectable()
export class TasksService {
  tasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description for Task 1',
      status: TaskStatus.OPEN,
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description for Task 2',
      status: TaskStatus.IN_PROGRESS,
    },
    {
      id: '3',
      title: 'Task 3',
      description: 'Description for Task 3',
      status: TaskStatus.DONE,
    },
    {
      id: '4',
      title: 'Task 4',
      description: 'Description for Task 4',
      status: TaskStatus.OPEN,
    },
    {
      id: '5',
      title: 'Task 5',
      description: 'Description for Task 5',
      status: TaskStatus.IN_PROGRESS,
    },
  ];
  getAllTasks() {
    return this.tasks;
  }

  getTasksByFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let result: Task[] = this.getAllTasks();

    if (search) {
      result = result.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    console.log(filterDto.status);
    if (status) {
      result = result.filter((task) => task.status === status);
    }

    return result;
  }

  getTaskById(id: string) {
    return this.tasks.find((t) => t.id === id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  updateTask(id: string, taskStatus: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = taskStatus;
    return task;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
