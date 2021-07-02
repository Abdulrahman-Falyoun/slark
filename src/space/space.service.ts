import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SLARK_SPACE } from '../utils/schema-names';
import { SpaceModel } from './space.model';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { WorkspaceService } from '../workspace/workspace.service';
import { UserService } from '../user/user.service';
import { WORKSPACE_OWNER } from '../utils/system-roles';
import { RoleService } from '../role/role.service';
import { UserModel } from '../user/user.model';
import { withTransaction } from '../utils/transaction-initializer';
import { MongoError } from 'mongodb';
import { GetAllSpacesDto } from './dto/get-all-spaces.dto';
@Injectable()
export class SpaceService {
  constructor(
    @InjectModel(SLARK_SPACE) private readonly spaceModel: Model<SpaceModel>,
    @Inject(forwardRef(() => WorkspaceService))
    private workspaceService: WorkspaceService,
    private userService: UserService,
    private roleService: RoleService,
  ) {}

  async createSpace(uid: string, data: CreateSpaceDto) {
    return await withTransaction(this.spaceModel, async (session) => {
      const w = await this.workspaceService.findOne({
        _id: data._workspace,
      });
      const s: SpaceModel = new this.spaceModel({ ...data, _workspace: w });
      await s.save({ session });
      return s;
      // await this.workspaceService.updateOne(
      //   {
      //     _id: s._workspace,
      //   },
      //   {
      //     $push: { _spaces: s },
      //   },
      //   { session },
      // );
      // await this.userService.updateUser(
      //   { _id: uid },
      //   {
      //     $push: { _spaces: s },
      //   },
      //   { session },
      // );
    });
  }

  async findAll(query?: GetAllSpacesDto) {
    let filterQuery: FilterQuery<SpaceModel> = {};
    if (query.workspaceId) {
      const w = await this.workspaceService.findOne({
        _id: query.workspaceId,
      });
      filterQuery._workspace = {
        $eq: w._id,
      };
    }
    return this.spaceModel.find(filterQuery);
  }
  async findOne(filterQuery: FilterQuery<SpaceModel>) {
    return await this.spaceModel
      .findOne(filterQuery)
      .populate('_workspace')
      .then((r) => {
        if (!r) {
          throw new MongoError({
            error: `Space not found`,
          });
        }
        return r;
      });
  }

  async deleteSpace(user: UserModel, id: string, workspaceId: string) {
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
    const w = await this.workspaceService.findOne({
      _id: workspaceId,
    });
    const s = await this.findOne({
      _id: id,
      _workspace: w._id,
    });
    await s.deleteOne();
    return s;
  }

  async updateSpaceByAdmin(
    id,
    workspaceId: string,
    user: UserModel,
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

  async updateSpace(
    filterQuery: FilterQuery<SpaceModel>,
    updateQuery: UpdateQuery<SpaceModel>,
    queryOptions?: QueryOptions,
  ) {
    const s = await this.findOne(filterQuery);
    await s.updateOne(updateQuery, queryOptions).then((r) => {
      if (r.nModified < 1) {
        throw new MongoError({
          message: `Space not updated`,
        });
      }
      return r;
    });
    return this.findOne(filterQuery);
  }
}
