import {Module} from '@nestjs/common';
import {TaskService} from './task.service';
import {TaskController} from './task.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {TASK_SCHEMA_NAME, TaskSchema} from "./entities/task.entity";

@Module({
    imports: [
        MongooseModule.forFeature([{name: TASK_SCHEMA_NAME, schema: TaskSchema}]),
    ],
    controllers: [TaskController],
    providers: [TaskService],
    exports: [
        MongooseModule.forFeature([{name: TASK_SCHEMA_NAME, schema: TaskSchema}]),
    ]
})
export class TaskModule {
}
