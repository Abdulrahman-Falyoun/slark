import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SLARK_SPACE } from '../utils/schema-names';
import { Space } from './entities/space.entity';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { WorkspaceService } from '../workspace/workspace.service';
import { UserService } from '../user/user.service';
import { UserUtilsService } from '../user/user-utils.service';
import { WORKSPACE_OWNER } from '../utils/system-roles';
import { RoleService } from '../role/role.service';
import { User } from '../user/entities/user';
import { withTransaction } from '../utils/transaction-initializer';
import { MongoError } from 'mongodb';
@Injectable()
export class SpaceService {
  constructor(
    @InjectModel(SLARK_SPACE) private readonly spaceModel: Model<Space>,
    private workspaceService: WorkspaceService,
    private userService: UserService,
    private userUtilsService: UserUtilsService,
    private roleService: RoleService,
  ) {}

  async createSpace(uid: string, data: CreateSpaceDto) {
    const s: Space = new this.spaceModel({
      ...data,
      _users: [uid],
    });
    return await withTransaction(this.spaceModel, async (session) => {
      await s.save({ session });
      await this.workspaceService.updateOne(
        {
          _id: s._workspace,
        },
        {
          $push: { _spaces: s },
        },
        { session },
      );
      await this.userService.updateUser(
        uid,
        {
          $push: { _spaces: s },
        },
        { session },
      );
    });
  }

  async deleteSpace(user: User, id: string, workspaceId: string) {
    const hasRole = this.roleService.hasRoleOverTarget(
      user,
      workspaceId,
      WORKSPACE_OWNER,
    );
    if (!hasRole) {
      return {
        message: 'You dont have right roles to execute this operation',
      };
    }

    const w = await this.spaceModel.findById(id);
    if (!w) {
      return {
        message: `Could not find a space with id: ${id}`,
      };
    }
    await w.deleteOne();
    return {
      message: 'Space got removed successfully',
    };
  }

  async updateSpaceByAdmin(
    id,
    workspaceId: string,
    user: User,
    updateQuery: UpdateQuery<this>,
    queryOptions?: QueryOptions,
  ) {
    const hasRole = this.roleService.hasRoleOverTarget(
      user,
      workspaceId,
      WORKSPACE_OWNER,
    );
    if (!hasRole) {
      return {
        message: 'You dont have right roles to execute this operation',
      };
    }
    return this.updateSpace({ _id: id }, updateQuery, queryOptions);
  }

  async findOne(filterQuery: FilterQuery<Space>) {
    return await this.spaceModel
      .findOne(filterQuery)
      .select({ __v: 0, name: 0, _id: 0, _workspace: 0 })
      .then((r) => {
        if (!r) {
          throw new NotFoundException({
            message: `Space not found`,
          });
        }
        return r;
      });
  }

  async updateSpace(
    filterQuery: FilterQuery<Space>,
    updateQuery: UpdateQuery<Space>,
    queryOptions?: QueryOptions,
  ) {
    const w = await this.findOne(filterQuery);
    await w
      .updateOne(updateQuery, queryOptions)
      .then((r) => {
        if (r.nModified > 0) {
          return w;
        }
        throw new MongoError({
          message: `Space not updated`,
        });
      })
      .catch((e) => {
        console.log('Error: [space.service.ts]: ', e.message || e);
        return null;
      });
    return w;
  }
}
