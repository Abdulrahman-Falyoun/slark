import {Module} from '@nestjs/common';
import {TaskService} from './task.service';
import {TaskController} from './task.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {TASK_SCHEMA_NAME, TaskSchema} from "./entities/task.entity";
import {SLARK_TASK} from "../utils/schema-names";

@Module({
    imports: [
        MongooseModule.forFeature([{name: SLARK_TASK, schema: TaskSchema}]),
    ],
    controllers: [TaskController],
    providers: [TaskService]
})
export class TaskModule {
}
