import {Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Req, Res} from '@nestjs/common';
import {WorkspaceService} from './workspace.service';
import {CreateWorkspaceDto} from './dto/create-workspace.dto';
import {UpdateWorkspaceDto} from './dto/update-workspace.dto';
import {operationsCodes} from "../utils/operation-codes";

@Controller('workspace')
export class WorkspaceController {
    constructor(private readonly workspaceService: WorkspaceService) {
    }

    @Post()
    @UsePipes(ValidationPipe)
    create(@Req() req, @Body() createWorkspaceDto: CreateWorkspaceDto) {
        return this.workspaceService.createWorkspace(req.user, createWorkspaceDto);
    }

    @Get('/join-workspace/:workspaceId/:email/:token')
    async addUserToWorkspace(
        @Param('workspaceId') workspaceId: string,
        @Param('email') email: string,
        @Param('token') token: string,
        @Res() res,
    ) {
        const response = await this.workspaceService.addUserToWorkspace(workspaceId, email, token);
        return res.status(operationsCodes.getResponseCode(response.code)).json(response);
    }
}
