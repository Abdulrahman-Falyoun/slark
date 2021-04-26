import {Injectable} from '@nestjs/common';
import {CreateTaskDto} from './dto/create-task.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Task} from "./entities/task.entity";
import {ClientSession, Model} from "mongoose";
import {SLARK_TASK} from "../utils/schema-names";
import {operationsCodes} from "../utils/operation-codes";
import {wrapFunctionWithinTransaction} from "../utils/transaction-initializer";
import {ListService} from "../list/list.service";
import {UserUtilsService} from "../user/user-utils.service";

@Injectable()
export class TaskService {
    constructor(
        // @ts-ignore
        @InjectModel(SLARK_TASK) private readonly taskModel: Model<Task>,
        private listService: ListService,
        private userUtilsService: UserUtilsService
    ) {
    }


    async createTask(task: CreateTaskDto) {
        if (!task._list) {
            return {
                code: operationsCodes.MISSING_DATA,
                message: `There are some missing data, required fields (_list), received undefined for one or both of them`,
            };
        }
        const taskInstance = new this.taskModel(task);
        return await wrapFunctionWithinTransaction(
            this.taskModel,
            async (session: ClientSession) => {
                // Creating new task
                const t: Task = await taskInstance.save({session});

                // Updating list
                await this.listService.updateList(
                    t._list,
                    {$push: {_tasks: t}},
                    {session}
                );
            },
            {
                task: taskInstance,
                message: "Task created successfully.!",
            },
            {
                message: "Could not create task ",
            }
        );
    }

    async updateTask(taskId, updatedData) {
        if (!taskId) {
            return {
                code: operationsCodes.MISSING_DATA,
                message: "You should provide a valid task id: received: " + taskId,
            };
        }
        if (!updatedData) {
            return {
                code: operationsCodes.MISSING_DATA,
                message: `Nothing to update: received: ${JSON.stringify(updatedData)}`,
            };
        }
        const task: Task = await this.taskModel.findById({_id: taskId});
        if (!task) {
            return {
                message: `There's no task associated with ID: ${taskId}`,
                code: operationsCodes.UNAVAILABLE_RESOURCE,
            };
        }

        return await wrapFunctionWithinTransaction(
            this.taskModel,
            async (session: ClientSession) => {
                if (
                    updatedData?._assignedUsers &&
                    updatedData?._assignedUsers.length > 0
                ) {
                    const oldAssignedUsers = task._assignedUsers;
                    const newAssignUsers = updatedData?._assignedUsers;
                    let usersMustBeAssignedThisTask = newAssignUsers.filter(
                        (item) => oldAssignedUsers.indexOf(item) < 0
                    );
                    await this.userUtilsService.updateMany(
                        {_id: usersMustBeAssignedThisTask},
                        {$push: {_tasks: task._id}},
                        {session}
                    );
                    let usersShouldBeOmittedFromAssignUsersToThisTask = oldAssignedUsers.filter(
                        (item) => newAssignUsers.indexOf(item) < 0
                    );
                    await this.userUtilsService.updateMany(
                        {_id: usersShouldBeOmittedFromAssignUsersToThisTask},
                        {$pullAll: {_tasks: [task._id]}},
                        {session}
                    );
                }
                await this.taskModel.updateOne(
                    {_id: taskId},
                    {$set: updatedData},
                    {session}
                );
            },
            {
                code: operationsCodes.SUCCESS,
                message: "Task updated successful",
            },
            {
                code: operationsCodes.DATABASE_ERROR,
                message: "Could not update task",
            }
        );
    }

    async deleteTask(taskId) {
        if (!taskId) {
            return {
                code: operationsCodes.MISSING_DATA,
                message: "You should provide a valid task id: received: " + taskId,
            };
        }
        try {
            const task: Task = await this.taskModel.findById({_id: taskId});
            if (!task) {
                return {
                    code: operationsCodes.MISSING_DATA,
                    message: "Task does not exist",
                };
            }
            await task.deleteOne();
            return {
                code: operationsCodes.SUCCESS,
                message: "Task deleted successfully",
            };
        } catch (e) {
            console.log("Error [task.service.ts]: ", e.message || e);
            return {
                code: operationsCodes.DATABASE_ERROR,
                message: "Could not remove task",
                e,
            };
        }
    }

}
