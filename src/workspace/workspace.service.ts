import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Workspace } from './workspace.model';
import {
  ClientSession,
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { SLARK_WORKSPACE } from '../utils/schema-names';
import { UserModel } from '../user/user.model';
import { withTransaction } from '../utils/transaction-initializer';
import { MongoError } from 'mongodb';

import { UserUtilsService } from '../user/user-utils.service';
import { WORKSPACE_OWNER } from '../utils/system-roles';
import { mailService } from '../services/mail.service';
import { RoleService } from '../role/role.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(SLARK_WORKSPACE)
    private readonly workspaceModel: Model<Workspace>,
    private userUtilsService: UserUtilsService,
    private authenticationService: AuthenticationService,
    private roleService: RoleService,
  ) {}

  async createWorkspace(user: UserModel, name) {
    return await withTransaction(
      this.workspaceModel,
      async (session: ClientSession) => {
        const workspace = new this.workspaceModel({
          name,
          _users: [user],
        });
        const iworkspace = await workspace.save({ session });
        console.log({ iworkspace });
        const role = await this.roleService.createNewRole(
          {
            ...WORKSPACE_OWNER,
            targetId: iworkspace.id,
          },
          { session },
        );
        user._roles.push(role);
        user._workspaces.push(iworkspace);
        await user.save({ session });
        return iworkspace;
      },
    );
  }

  async findOne(filterQuery: FilterQuery<Workspace>) {
    return await this.workspaceModel.findOne(filterQuery).then((r) => {
      if (!r) {
        throw new MongoError({
          msg: `Workspace not found`,
        });
      }
      return r;
    });
  }

  findAll(filterQuery: FilterQuery<Workspace>) {
    return this.workspaceModel.find(filterQuery);
  }

  async removeWorkspace(id: string, user: UserModel) {
    const hasRole = this.roleService.hasRoleOverTarget(
      user,
      id,
      WORKSPACE_OWNER,
    );
    if (!hasRole) {
      throw new Error('You dont have right roles to execute this operation');
    }
    const w = await this.findOne({
      _id: id,
    });
    return await withTransaction(this.workspaceModel, async (session) => {
      // user._workspaces = user._workspaces.filter((_w) => _w._id !== id);
      // await user.save({ session });
      await this.userUtilsService.updateMany(
        {
          _workspaces: {
            $elemMatch: w._id,
          },
        },
        {
          $pull: {
            _workspaces: [id],
          },
        },
      );
      await w.deleteOne({ session });
    });
  }

  async inviteUserToWorkspace(
    sender: UserModel,
    workspaceName: string,
    workspaceId: string,
    userEmail: string,
  ) {
    const user = await this.userUtilsService.getUserByEmail(userEmail);
    const token = await this.authenticationService.generateAccessToken({
      id: user.id,
      email: user.email,
    });
    try {
      await mailService.sendEmailNodeMailer(user, token, {
        from: 'no-reply@slark.com',
        to: user.email,
        subject: 'Workspace invitation',
        text: 'workspace invitation',
        html: `
                    <pre>
                        Hello ${user.name}\n\n
                        ${sender.name} Sent you an invitation request to join ${workspaceName} workspace:\n
                    <a href="http://localhost:3000/workspace/join-workspace/${workspaceId}/${user.email}/${token}" target="_blank">
                        Accept invitation
                    </a>\n\nThank You!\n
                    </pre>`,
      });
    } catch (e) {
      console.log('Error [workspace.service.ts]: ', e.message || e);
      return {
        message: 'Could not send an invitation',
        error: e.message || e,
      };
    }
  }

  async addUserToWorkspace(workspaceId, email) {
    const user: UserModel = await this.userUtilsService.getUserByEmail(email);
    return await withTransaction(this.workspaceModel, async (session) => {
      await this.userUtilsService.updateOne(
        { email: email },
        { $push: { _workspaces: workspaceId } },
        { session },
      );
      await this.updateOne(
        { _id: workspaceId },
        { $push: { _users: user.id } },
        { session },
      );
    });
  }

  async removeUserFromWorkspace(admin: UserModel, workspaceId, userId) {
    const hasRole = await this.roleService.hasRoleOverTarget(
      admin,
      workspaceId,
      WORKSPACE_OWNER,
    );
    if (!hasRole) {
      throw new Error(
        `You dont have owner permission over ${workspaceId} workspace`,
      );
    }
    return await withTransaction(this.workspaceModel, async (session) => {
      await this.updateOne(
        { _id: workspaceId },
        { $pull: { _users: userId } },
        { session },
      );
      await this.userUtilsService.updateOne(
        { _id: userId },
        { $pull: { _workspaces: workspaceId } },
        { session },
      );
    });
  }

  async updateOne(
    filterQuery: FilterQuery<Workspace>,
    updateQuery: UpdateQuery<Workspace>,
    opts?: QueryOptions,
  ) {
    const p = await this.findOne(filterQuery);
    return await p
      .updateOne(updateQuery, opts)
      .then((p) => p)
      .catch((e) => {
        console.log('Error in updating workspace [workspace.service]: ', e);
        return null;
      });
  }
}
