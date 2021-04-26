import {Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Req} from '@nestjs/common';
import {WorkspaceService} from './workspace.service';
import {CreateWorkspaceDto} from './dto/create-workspace.dto';
import {UpdateWorkspaceDto} from './dto/update-workspace.dto';

@Controller('workspace')
export class WorkspaceController {
    constructor(private readonly workspaceService: WorkspaceService) {
    }

    @Post()
    @UsePipes(ValidationPipe)
    create(@Req() req, @Body() createWorkspaceDto: CreateWorkspaceDto) {
        return this.workspaceService.createWorkspace(req.user, createWorkspaceDto);
    }
}
