import {Injectable} from '@nestjs/common';
import {CreateSpaceDto} from './dto/create-space.dto';
import {operationsCodes} from "../utils/operation-codes";
import {InjectModel} from "@nestjs/mongoose";
import {SLARK_SPACE} from "../utils/schema-names";
import {Space} from "./entities/space.entity";
import {FilterQuery, Model, QueryOptions, UpdateQuery} from "mongoose";
import {wrapFunctionWithinTransaction} from "../utils/transaction-initializer";
import {WorkspaceService} from "../workspace/workspace.service";
import {UserService} from "../user/user.service";
import {UserUtilsService} from "../user/user-utils.service";
import {WORKSPACE_OWNER} from "../utils/system-roles";
import {RoleService} from "../role/role.service";
import {User} from "../user/entities/user";

@Injectable()
export class SpaceService {
    constructor(
        @InjectModel(SLARK_SPACE) private readonly spaceModel: Model<Space>,
        private workspaceService: WorkspaceService,
        private userService: UserService,
        private userUtilsService: UserUtilsService,
        private roleService: RoleService
    ) {
    }

    async createSpace(uid: string, data: CreateSpaceDto) {
        if (!data || !data._workspace || !data.name) {
            return {
                code: operationsCodes.MISSING_DATA,
                message:
                    "You provide enough data, received: " +
                    JSON.stringify(data) +
                    "\n required fields: {name, _workspace}",
            };
        }
        const s: Space = new this.spaceModel({
            ...data,
            _users: [uid],
        });
        return await wrapFunctionWithinTransaction(
            this.spaceModel,
            async (session) => {
                await s.save({session});
                await this.workspaceService.updateWorkspace(
                    s._workspace
                    ,
                    {
                        $push: {_spaces: s},
                    },
                    {session}
                );

                await this.userService.updateUser(
                    uid,
                    {
                        $push: {_spaces: s},
                    },
                    {session}
                );
            },
            {
                message: "Space got created successfully",
                code: operationsCodes.SUCCESS,
                name: s.name,
                id: s._id,
            },
            {
                code: operationsCodes.DATABASE_ERROR,
                message: "Could perform space creation",
            }
        );
    }

    async deleteSpace(user: User, id: string, workspaceId: string) {
        try {
            if (!id || !workspaceId) {
                return {
                    code: operationsCodes.MISSING_DATA,
                    message: `You should provide a valid space & workspace IDs, received: id -> ${id}, workspaceId -> ${workspaceId}`,
                };
            }

            const hasRole = this.roleService.hasRoleOverTarget(
                user,
                workspaceId,
                WORKSPACE_OWNER
            );
            if (!hasRole) {
                return {
                    code: operationsCodes.AUTHORIZATION_FAILED,
                    message: "You dont have right roles to execute this operation",
                };
            }

            const w = await this.spaceModel.findById(id);
            if (!w) {
                return {
                    code: operationsCodes.UNAVAILABLE_RESOURCE,
                    message: `Could not find a space with id: ${id}`,
                };
            }
            await w.deleteOne();
            return {
                message: "Space got removed successfully",
                code: operationsCodes.SUCCESS,
            };
        } catch (e) {
            console.log("Error: [space.service.ts]: ", e.message || e);
            return {
                code: operationsCodes.DATABASE_ERROR,
                message: "Could perform space deletion",
                e: e.message || e,
            };
        }
    }

    async updateOne<T>(
        filterQuery: FilterQuery<T>,
        updateQuery: UpdateQuery<T>,
        queryOptions?: QueryOptions
    ) {
        return this.spaceModel.updateOne(filterQuery, updateQuery, queryOptions);
    }

    async updateMany<T>(
        filterQuery: FilterQuery<T>,
        updateQuery: UpdateQuery<T>,
        queryOptions?: QueryOptions
    ) {
        return this.spaceModel.updateMany(filterQuery, updateQuery, queryOptions);
    }

    async findSpaceById(id, opts?: QueryOptions): Promise<Space> {
        return await this.spaceModel
            .findById({_id: id}, null, opts)
            .then((p) => p)
            .catch((e) => {
                console.log(
                    "error while getting space [space.service.ts]: ",
                    e.message || e
                );
                return null;
            });
    }

    async updateSpaceByAdmin(
        id,
        workspaceId: string,
        user: User,
        updateQuery: UpdateQuery<this>,
        queryOptions?: QueryOptions
    ) {
        try {
            if (!id || !workspaceId) {
                return {
                    code: operationsCodes.MISSING_DATA,
                    message: `You should provide a valid space ID, received: ${id} :: ${workspaceId}\n required fields: {id, workspaceId}`,
                };
            }
            const hasRole = this.roleService.hasRoleOverTarget(
                user,
                workspaceId,
                WORKSPACE_OWNER
            );
            if (!hasRole) {
                return {
                    code: operationsCodes.AUTHORIZATION_FAILED,
                    message: "You dont have right roles to execute this operation",
                };
            }
            const w = await this.findSpaceById(id, queryOptions);
            await w.updateOne(updateQuery, queryOptions);
            return {
                message: "Space updated successfully",
                code: operationsCodes.SUCCESS,
            };
        } catch (e) {
            console.log("updating space error [space.service.ts]: ", e.message || e);
            return {
                error: e.message || e,
                message: "Error while updating space, kindly try a bit later",
                code: operationsCodes.DATABASE_ERROR,
            };
        }
    }

    async getSpaceDetails(id) {
        if (!id) {
            return {
                message: "You should provide an id, recieved undefined",
                code: operationsCodes.MISSING_DATA,
            };
        }
        const space: Space = await this.spaceModel
            .findById(id)
            .select({__v: 0, name: 0, _id: 0, _workspace: 0})
            .populate("_users", {name: 1})
            .populate("_tasks", {name: 1})
            .populate("_columns", {name: 1});
        if (!space) {
            return {
                message: "Could not find space assoiciated with id: " + id,
                code: operationsCodes.UNAVAILABLE_RESOURCE,
            };
        }
        return {
            message: "Space grabbed successfully",
            space,
            code: operationsCodes.SUCCESS,
        };
    }

    async updateSpace(
        id,
        updateQuery: UpdateQuery<this>,
        queryOptions?: QueryOptions
    ) {
        const w = await this.findSpaceById(id, queryOptions);
        return await w
            .updateOne(updateQuery, queryOptions)
            .then((r) => r)
            .catch((e) => {
                console.log("Error: [space.service.ts]: ", e.message || e);
                return null;
            });
    }
}
