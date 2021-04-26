import {Injectable} from '@nestjs/common';
import {CreateWorkspaceDto} from './dto/create-workspace.dto';
import {UpdateWorkspaceDto} from './dto/update-workspace.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Workspace, WORKSPACE_SCHEMA_NAME} from "./entities/workspace.entity";
import {Model} from "mongoose";

@Injectable()
export class WorkspaceService {
    constructor(@InjectModel(WORKSPACE_SCHEMA_NAME) private readonly workspaceModel: Model<Workspace>) {
    }

    async create(createWorkspaceDto: CreateWorkspaceDto) {
        createWorkspaceDto['createdAt'] = new Date();
        const createdWorkspace = new this.workspaceModel(createWorkspaceDto);
        console.log('createdWorkspace: ', createdWorkspace);
        return await createdWorkspace.save();
    }

    findAll() {
        return `This action returns all workspace`;
    }

    findOne(id: number) {
        return `This action returns a #${id} workspace`;
    }

    update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
        return `This action updates a #${id} workspace`;
    }

    remove(id: number) {
        return `This action removes a #${id} workspace`;
    }
}
