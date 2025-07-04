import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './entity/task.entity';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService:TasksService) {}

    @Get()
    async findAll(
        @Query('status') status?: string,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10
    ):Promise<{
        data:Task[];
        total: number
    }> {
        return this.taskService.findAll({status, page, limit});
    }

    @Get(':id')
    async findOne(@Param("id", ParseIntPipe) id: number):Promise<Task> {
        return this.taskService.findOne(id);
    }
    
    @Post()
    async create(@Body() dto:CreateTaskDto):Promise<Task> {
        return this.taskService.create(dto);
    }

    @Delete(':id')
    async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.taskService.remove(id);
    }
    
}