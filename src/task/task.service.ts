import {Injectable} from '@nestjs/common';
import {CreateTaskDto} from './dto/create-task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Task} from "./entities/task.entity";
import {Model} from "mongoose";
import {SLARK_TASKS} from "../utils/schema-names";

@Injectable()
export class TaskService {
    // @ts-ignore
    constructor(@InjectModel(SLARK_TASKS) private readonly taskModel: Model<Task>) {
    }


    async create(createTaskDto: CreateTaskDto) {
        const t: Task = new this.taskModel(createTaskDto);
        return t.save();
    }

    findAll() {
        return `This action returns all task`;
    }

    findOne(id: number) {
        return `This action returns a #${id} task`;
    }

    update(id: number, updateTaskDto: UpdateTaskDto) {
        return `This action updates a #${id} task`;
    }

    remove(id: number) {
        return `This action removes a #${id} task`;
    }
}
