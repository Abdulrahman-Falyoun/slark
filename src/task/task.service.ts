import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './entities/task.entity';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { SLARK_TASK } from '../utils/schema-names';
import { withTransaction } from '../utils/transaction-initializer';
import { ListService } from '../list/list.service';
import { MongoError } from 'mongodb';
import { UserService } from '../user/user.service';

@Injectable()
export class TaskService {
  constructor(
    // @ts-ignore
    @InjectModel(SLARK_TASK) private readonly taskModel: Model<Task>,
    private listService: ListService,
    private userService: UserService,
  ) {}

  async createTask(task: CreateTaskDto) {
    const taskInstance = new this.taskModel(task);
    return await withTransaction(
      this.taskModel,
      async (session: ClientSession) => {
        // Creating new task
        const t: Task = await taskInstance.save({ session });

        // Updating list
        await this.listService.mongooseUpdate(
          { _id: t._list },
          { $push: { _tasks: t } },
          { session },
        );
      },
    );
  }

  async updateTask(taskId, updatedData) {
    const task: Task = await this.findOne({ _id: taskId });
    return await withTransaction(
      this.taskModel,
      async (session: ClientSession) => {
        if (
          updatedData?._assignedUsers &&
          updatedData?._assignedUsers.length > 0
        ) {
          const oldAssignedUsers = task._assignedUsers;
          const newAssignUsers = updatedData?._assignedUsers;
          let usersMustBeAssignedThisTask = newAssignUsers.filter(
            (item) => oldAssignedUsers.indexOf(item) < 0,
          );
          await this.userService.updateMultipleUsers(
            { _id: usersMustBeAssignedThisTask },
            { $push: { _tasks: task._id } },
            { session },
          );
          let usersShouldBeOmittedFromAssignUsersToThisTask = oldAssignedUsers.filter(
            (item) => newAssignUsers.indexOf(item) < 0,
          );
          await this.userService.updateMultipleUsers(
            { _id: usersShouldBeOmittedFromAssignUsersToThisTask },
            { $pullAll: { _tasks: [task._id] } },
            { session },
          );
        }
        await this.taskModel.updateOne(
          { _id: taskId },
          { $set: updatedData },
          { session },
        );
      },
    );
  }

  async findOne(filterQuery: FilterQuery<Task>) {
    return await this.taskModel.findOne(filterQuery).then((r) => {
      if (!r) {
        throw new MongoError({
          message: `Task not found`,
        });
      }
      return r;
    });
  }
  async deleteTask(taskId) {
    const task: Task = await this.findOne({ _id: taskId });
    await task.deleteOne();
  }
}
