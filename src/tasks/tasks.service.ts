import { GetTaskFilterDto } from './dtos/get-tasks-filter.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Build Smart Contract',
      description: 'To Generate ERC20 Wallet for reseller customers',
      status: TaskStatus.OPEN,
    },
    {
      id: '2',
      title: 'Build Factory Contract',
      description: 'To Generate ERC20 Wallet for reseller customers',
      status: TaskStatus.OPEN,
    },
    {
      id: '3',
      title: 'Mett the team',
      description: 'Discuss the solution with the team',
      status: TaskStatus.OPEN,
    },
  ];
  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;

    let filteredTasks: Task[] = this.tasks;

    if (status) {
      filteredTasks = this.tasks.filter((task) => task.status === status);
    }

    if (search) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return filteredTasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: (this.tasks.length + 1).toString(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  deleteTask(id: string) {
    const currentTasksLength = this.tasks.length;

    this.tasks = this.tasks.filter((task) => task.id !== id);

    if (this.tasks.length === currentTasksLength) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
