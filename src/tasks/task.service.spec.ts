import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { NotFoundError } from 'rxjs';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'Staffano',
  id: 'someId',
  password: 'somePW',
  task: [],
};
describe('TaskService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    // init a NestJS module with taskService and tasksRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();
    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<TasksRepository>(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskByID', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        task: 'Test title',
        description: 'Test desc',
        id: 'someID',
        status: TaskStatus.OPEN,
      };
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someID', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls TasksRepository.findOne and handles an error', async () => {
        tasksRepository.findOne.mockResolvedValue(null);
        expect(tasksService.getTaskById('someID',mockUser)).rejects.toThrow(NotFoundException);




    });
  });
});
