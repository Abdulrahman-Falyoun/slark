import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Workspace } from './entities/workspace.entity';
import {
  ClientSession,
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { SLARK_WORKSPACE } from '../utils/schema-names';
import { operationsCodes } from '../utils/operation-codes';
import { User } from '../user/entities/user';
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

  async createWorkspace(user: User, name) {
    const workspace = new this.workspaceModel({
      name,
      _users: [user],
    });

    return await withTransaction(
      this.workspaceModel,
      async (session: ClientSession) => {
        const iworkspace = await workspace.save({ session });
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

  async removeWorkspace(id: string, user: User) {
    // const hasRole = this.roleService.hasRoleOverTarget(
    //   user,
    //   id,
    //   WORKSPACE_OWNER,
    // );
    // if (!hasRole) {
    //   return {
    //     code: operationsCodes.AUTHORIZATION_FAILED,
    //     message: 'You dont have right roles to execute this operation',
    //   };
    // }
    const p = await this.findOne({
      _id: id,
    });
    // await this.workspaceModel.deleteOne({ _id: id });
    await p.deleteOne();
  }

  async inviteUserToWorkspace(
    sender: User,
    workspaceName: string,
    workspaceId: string,
    userEmail: string,
  ) {
    const user = await this.userUtilsService.getUserByEmail(userEmail);
    if (!user) {
      return {
        code: operationsCodes.UN_COMPLETE,
        message: `User with email ${userEmail} does not exist, please make sure he signed up`,
      };
    }
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

      return {
        message: 'An invitation sent to ' + user.email,
        code: operationsCodes.SUCCESS,
      };
    } catch (e) {
      console.log('Error [workspace.service.ts]: ', e.message || e);
      return {
        code: operationsCodes.DATABASE_ERROR,
        message: 'Could not send an invitation',
        error: e.message || e,
      };
    }
  }

  async addUserToWorkspace(workspaceId, email) {
    const user: User = await this.userUtilsService.getUserByEmail(email, false);
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

  async removeUserFromWorkspace(admin: User, workspaceId, userId) {
    if (!userId) {
      return {
        message: 'Missing data, required(userId) but received -> ' + userId,
        code: operationsCodes.MISSING_DATA,
      };
    }
    const hasRole = await this.roleService.hasRoleOverTarget(
      admin,
      workspaceId,
      WORKSPACE_OWNER,
    );
    if (!hasRole) {
      return {
        code: operationsCodes.AUTHORIZATION_FAILED,
        message: `You dont have owner permission over ${workspaceId} workspace`,
      };
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
