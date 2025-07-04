import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entity/task.entity';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly repository: Repository<Task>,
  ) {}
  // si se veulve muy pesado, se puede crear un use case, tipo src/tasks/use-cases/task.find-all.use-case.ts, ese tendria el repo,
  async findAll(options:{status?:string, page:number, limit:number}): Promise<{
    data: Task[];
    total: number;
  }> {
    const qb = this.repository.createQueryBuilder('task');
    if (options.status) {
      qb.where('task.status = :status', { status: options.status });
    }
    const [data, total] = await qb
      .skip((options.page - 1) * options.limit)
      .take(options.limit)
      .orderBy('task.createdAt', 'DESC')
      .getManyAndCount();

    return {data,total};
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.repository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task with id ' + id + ' not found');
    }
    return task;
  }

  async create(taskDto: CreateTaskDto): Promise<Task> {
    const newTask: Task = await this.repository.save({
      ...taskDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newTask;
  }

  async remove(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Task with id ' + id + ' not found');
    }
  }

  async update(id: number, taskDto: CreateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, taskDto, { updatedAt: new Date() });
    return this.repository.save(task);
  }
}
