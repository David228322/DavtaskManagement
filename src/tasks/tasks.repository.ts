import {DataSource, Repository} from 'typeorm';
import {Task} from './task.entity';
import {CreateTaskDto} from './dto/create-task.dto';
import {TaskStatus} from './task-status.enum';
import {Injectable} from '@nestjs/common';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {User} from "../auth/user.entity";

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { search, status } = filterDto;
    const query = await this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    return await query.getMany();
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);
    return task;
  }
}
