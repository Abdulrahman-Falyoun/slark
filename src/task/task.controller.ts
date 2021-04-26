import {Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, Put} from '@nestjs/common';
import {TaskService} from './task.service';
import {CreateTaskDto} from './dto/create-task.dto';
import {operationsCodes} from "../utils/operation-codes";
import {JwtAuthGuard} from "../authentication/jwt-auth.guard";

@Controller('task')
@UseGuards(JwtAuthGuard)
export class TaskController {
    constructor(private readonly taskService: TaskService) {
    }

    @Post()
    async createTask(@Res() res, @Body() createTaskDto: CreateTaskDto) {
        const response = await this.taskService.createTask(createTaskDto);
        return res
            .status(operationsCodes.getResponseCode(response.code))
            .json(response);
    }

    @Delete('/:id')
    async deleteTask(@Res() res, @Param('id') id: string) {
        const response = await this.taskService.deleteTask(id);
        return res.status(operationsCodes.getResponseCode(response.code)).json(response);
    }

    @Put('/:id')
    async updateTask(@Res() res, @Req() req, @Param('id') id: string) {
        const response = await this.taskService.updateTask(id, req.body);
        return res.status(operationsCodes.getResponseCode(response.code)).json(response);
    }

}
