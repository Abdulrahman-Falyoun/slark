import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetAllTasksDto } from './dto/get-all-tasks.dto';

@ApiTags('Task')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask({
      _id: id,
    });
  }

  @Put('/:id')
  updateTask(@Body() updateTaskDto: UpdateTaskDto, @Param('id') id: string) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Get(':id')
  getTask(@Param('id') id: string) {
    return this.taskService.findOne({
      _id: id,
    });
  }

  @Get()
  getAllTasks(@Query() query: GetAllTasksDto) {
    return this.taskService.findAll(query);
  }
}
