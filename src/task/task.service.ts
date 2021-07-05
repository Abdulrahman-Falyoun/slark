import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TaskModel } from './task.model';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { SLARK_TASK } from '../utils/schema-names';
import { withTransaction } from '../utils/transaction-initializer';
import { ListService } from '../list/list.service';
import { MongoError } from 'mongodb';
import { UserService } from '../user/user.service';
import { FileUploadService } from '../../libs/file-upload/src';
import { GetAllTasksDto } from './dto/get-all-tasks.dto';

@Injectable()
export class TaskService {
  constructor(
    // @ts-ignore
    @InjectModel(SLARK_TASK) private readonly taskModel: Model<TaskModel>,
    private listService: ListService,
    private userService: UserService,
    private fileUploadService: FileUploadService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
    let l;
    let assets = [];
    if (createTaskDto._list) {
      l = await this.listService.findList({
        _id: createTaskDto._list,
      });
    }

    if (createTaskDto.assets) {
      for (let asset of createTaskDto.assets) {
        assets.push(
          await this.fileUploadService.getFile({
            _id: asset,
          }),
        );
      }
    }
    console.log(assets);
    createTaskDto.assets = assets;
    createTaskDto._list = l._id;
    const taskInstance = new this.taskModel(createTaskDto);
    const itask = await taskInstance.save();
    return itask.populate('assets').populate('_list');
  }

  async updateTask(taskId, updatedData) {
    const task = await this.findOne({ _id: taskId });
    return await withTransaction(
      this.taskModel,
      async (session: ClientSession) => {
        if (
          updatedData?._assignedUsers &&
          updatedData?._assignedUsers.length > 0
        ) {
          for (let _u of updatedData._assignedUsers) {
            await this.userService.findOne({
              _id: _u,
            });
          }
          // const oldAssignedUsers = task._assignedUsers;
          // const newAssignUsers = updatedData?._assignedUsers;
          // let usersMustBeAssignedThisTask = newAssignUsers.filter(
          //   (item) => oldAssignedUsers.indexOf(item) < 0,
          // );
          // await this.userService.updateMultipleUsers(
          //   { _id: usersMustBeAssignedThisTask },
          //   { $push: { _tasks: task._id } },
          //   { session },
          // );
          // let usersShouldBeOmittedFromAssignUsersToThisTask = oldAssignedUsers.filter(
          //   (item) => newAssignUsers.indexOf(item) < 0,
          // );
          // await this.userService.updateMultipleUsers(
          //   { _id: usersShouldBeOmittedFromAssignUsersToThisTask },
          //   { $pullAll: { _tasks: [task._id] } },
          //   { session },
          // );
        }
        await this.taskModel.updateOne(
          { _id: taskId },
          { $set: updatedData },
          { session },
        );
        return this.findOne({
          _id: taskId,
        });
      },
    );
  }

  async findAll(getAllTasksDto: GetAllTasksDto) {
    let filterQuery: FilterQuery<TaskModel> = {};
    if (getAllTasksDto.listId) {
      const list = await this.listService.findList({
        _id: getAllTasksDto.listId,
      });
      filterQuery._list = {
        $eq: list._id,
      };
    }
    return this.taskModel
      .find(filterQuery)
      .populate('assets')
      .populate('_list');
  }
  async findOne(filterQuery: FilterQuery<TaskModel>) {
    return await this.taskModel
      .findOne(filterQuery)
      .populate('assets')
      .populate('_list')
      .then((r) => {
        if (!r) {
          throw new MongoError({
            message: `Task not found`,
          });
        }
        return r;
      });
  }
  async deleteTask(filterQuery: FilterQuery<TaskModel>) {
    const task = await this.findOne(filterQuery);
    await task.deleteOne();
    return task;
  }
}
