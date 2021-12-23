import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}


     getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
        return  this.tasksRepository.getTasks(filterDto);
    }


  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne(id);
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }


  async deleteTaskByID(id: string): Promise<void> {
      const result = await this.tasksRepository.delete(id);
      if(result.affected === 0){
        throw new NotFoundException(`Task with ID "${id}" not found`);
      }
      console.log(result)
}
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.tasksRepository.save(task)
    return task;
  }

  /*

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tmpTasks = this.getAllTasks();
    if (status) {
      tmpTasks = tmpTasks.filter((task) => task.status === status);
    }

    if (search) {
      tmpTasks = tmpTasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }

        return false;
      });
    }
    return tmpTasks;
  }




  */
}
