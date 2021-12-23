import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { title } from 'process';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
@Controller('tasks')
export class TasksController {
    constructor(private taskservice : TasksService){}

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]>{
      return this.taskservice.getTasks(filterDto)
    }


    @Get('/:id')
    getTaskById(@Param('id') id: string): Promise<Task>{
        return this.taskservice.getTaskById(id);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskservice.createTask(createTaskDto);
    }

    @Delete(':id')
    deleteTaskByID(@Param('id') id: string): Promise<void>{
        return this.taskservice.deleteTaskByID(id)
    }
    @Patch(':id/status')
    updateTaskStatus(@Param('id') id :string, @Body() updateTaskStatusDto: UpdateTaskStatusDto): Promise<Task>{
        const {status} = updateTaskStatusDto; 
        return this.taskservice.updateTaskStatus(id,status)
    }
/*








*/
}
