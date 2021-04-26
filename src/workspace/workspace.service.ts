import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Workspace} from "./entities/workspace.entity";
import {ClientSession, Model, QueryOptions, UpdateQuery} from "mongoose";
import {SLARK_WORKSPACE} from "../utils/schema-names";
import {operationsCodes} from "../utils/operation-codes";
import {User} from "../user/entities/user";
import {wrapFunctionWithinTransaction} from "../utils/transaction-initializer";
import {UserUtilsService} from "../user/user-utils.service";
import {WORKSPACE_OWNER} from "../utils/system-roles";
import {mailService} from "../services/mail.service";
import {RoleService} from "../role/role.service";
import {AuthenticationService} from "../authentication/authentication.service";

@Injectable()
export class WorkspaceService {
    constructor(
        @InjectModel(SLARK_WORKSPACE) private readonly workspaceModel: Model<Workspace>,
        private userUtilsService: UserUtilsService,
        private authenticationService: AuthenticationService,
        private roleService: RoleService
    ) {
    }


    async createWorkspace(user: User, name) {
        const workspace = new this.workspaceModel({
            name,
            startDate: new Date(),
            _users: [user],
        });

        return await wrapFunctionWithinTransaction(
            this.workspaceModel,
            async (session: ClientSession) => {
                const iworkspace = await workspace.save({session});
                const role = await this.roleService.createNewRole(
                    {
                        ...WORKSPACE_OWNER,
                        targetId: iworkspace.id,
                    },
                    {session}
                );
                user._roles.push(role);
                user._workspaces.push(iworkspace);
                await user.save({session});
            },
            {
                id: workspace._id,
                name: workspace.name,
                message: "Workspace created successfully",
            },
            {
                message: "Sorry, could not create this workspace",
            }
        );
    }

    async removeWorkspace(id: string, user: User) {
        try {

            if (!id) {
                return {
                    code: operationsCodes.MISSING_DATA,
                    message: `You should provide a valid workspace ID, received: ${id}`
                }
            }
            const hasRole = this.roleService.hasRoleOverTarget(user, id, WORKSPACE_OWNER);
            if (!hasRole) {
                return {
                    code: operationsCodes.AUTHORIZATION_FAILED,
                    message: "You dont have right roles to execute this operation",
                };
            }
            const p = await this.workspaceModel.findById(id);
            // await this.workspaceModel.deleteOne({ _id: id });
            await p.deleteOne();
            return {
                message: "Workspace removed successfully",
                code: operationsCodes.SUCCESS,
            };
        } catch (e) {
            console.log(
                "deleting workspace error [workspace.service.ts]: ",
                e.message || e
            );
            return {
                error: e.message || e,
                message: "Error while deleting workspace, kindly try a bit later",
                code: operationsCodes.DATABASE_ERROR,
            };
        }
    }

    async getWorkspaceDetails(id) {
        if (!id) {
            return {
                message: 'You should provide an id, recieved undefined',
                code: operationsCodes.MISSING_DATA
            }
        }
        const workspace: Workspace = await this.workspaceModel.findById(id)
            .select({__v: 0, _users: 0, _columns: 0, _tasks: 0, startDate: 0, progress: 0})
            // .populate('_users', { name: 1})
            // .populate('_tasks', { name: 1})
            // .populate('_columns', { name: 1})
            .populate('_workspaces', {name: 1});
        if (!workspace) {
            return {
                message: 'Could not find workspace associated with id: ' + id,
                code: operationsCodes.UNAVAILABLE_RESOURCE
            }
        }
        return {
            message: 'Workspace grabbed successfully',
            workspace,
            code: operationsCodes.SUCCESS
        }
    }

    async inviteUserToWorkspace(sender: User, workspaceName: string, workspaceId: string, userEmail: string) {

        const user = await this.userUtilsService.getUserByEmail(userEmail);
        if (!user) {
            return {
                code: operationsCodes.UN_COMPLETE,
                message: `User with email ${userEmail} does not exist, please make sure he signed up`
            }
        }
        const token = await this.authenticationService.generateAccessToken({
            id: user.id,
            email: user.email,
        });
        try {
            await mailService.sendEmailNodeMailer(
                user,
                token,
                {
                    from: "no-reply@slark.com",
                    to: user.email,
                    subject: "Workspace invitation",
                    text: "workspace invitation",
                    html: `
                    <pre>
                        Hello ${user.name}\n\n
                        ${sender.name} Sent you an invitation request to join ${workspaceName} workspace:\n
                    <a href="http://slark-backend.herokuapp.com/public/join-workspace/${workspaceId}/${user.email}/${token}" target="_blank">
                        Accept invitation
                    </a>\n\nThank You!\n
                    </pre>`,
                });

            return {
                message: 'An invitation sent to ' + user.email,
                code: operationsCodes.SUCCESS
            }

        } catch (e) {
            console.log('Error [workspace.service.ts]: ', (e.message || e));
            return {
                code: operationsCodes.DATABASE_ERROR,
                message: 'Could not send an invitation',
                error: (e.message || e)
            }
        }
    }

    async addUserToWorkspace(workspaceId, email, token) {
        if (!workspaceId || !email || !token) {
            return {
                code: operationsCodes.MISSING_DATA,
                message: `There're some required fields, (workspaceId, email, token) but received -> (${workspaceId}, ${email}, ${token})`
            };
        }
        const user: User = await this.userUtilsService.getUserByEmail(email, false);
        return await wrapFunctionWithinTransaction(
            this.workspaceModel,
            async (session) => {
                await this.userUtilsService.updateOne(
                    {email: email},
                    {$push: {_workspaces: workspaceId}},
                    {session}
                );
                await this.updateWorkspace(
                    workspaceId,
                    {$push: {_users: user.id}},
                    {session});
            },
            {
                message: 'User added to workspace',
                code: operationsCodes.SUCCESS
            },
            {
                message: 'Could not add user to workspace',
                code: operationsCodes.DATABASE_ERROR
            }
        );
    }

    async removeUserFromWorkspace(admin: User, workspaceId, userId) {
        if (!userId) {
            return {
                message: 'Missing data, required(userId) but received -> ' + userId,
                code: operationsCodes.MISSING_DATA
            }
        }


        const hasRole = await this.roleService.hasRoleOverTarget(admin, workspaceId, WORKSPACE_OWNER);

        if (!hasRole) {
            return {
                code: operationsCodes.AUTHORIZATION_FAILED,
                message: `You dont have owner permission over ${workspaceId} workspace`
            }
        }
        try {
            await this.updateWorkspace(workspaceId, {$pull: {_users: userId}});
            await this.userUtilsService.updateOne({_id: userId}, {$pull: {_workspaces: workspaceId}});
            return {
                code: operationsCodes.SUCCESS,
                message: 'User removed successfully'
            }
        } catch (e) {
            console.log('Error [workspace.service.ts] -> removeUserFromWorkspace: ', (e.message || e));
            return {
                code: operationsCodes.DATABASE_ERROR,
                message: 'Could not remove user',
                error: (e.message || e)
            }
        }
    }

    async updateWorkspace<T>(id, updateQuery: UpdateQuery<T>, opts?: QueryOptions) {
        const p = await this.findWorkspaceById(id, opts);
        return await p
            .updateOne(updateQuery, opts)
            .then((p) => p)
            .catch((e) => {
                console.log("Error in updating workspace [workspace.service]: ", e);
                return null;
            });
    }

    async findWorkspaceById(id, opts?: QueryOptions): Promise<Workspace> {
        return await this.workspaceModel
            .findById({_id: id}, null, opts)
            .then((p) => p)
            .catch((e) => {
                console.log("error while getting workspace [workspace.service.ts]: ", e);
                return null;
            });
    }
}
