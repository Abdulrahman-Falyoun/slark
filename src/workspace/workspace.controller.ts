import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UsePipes,
    ValidationPipe,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import {WorkspaceService} from './workspace.service';
import {CreateWorkspaceDto} from './dto/create-workspace.dto';
import {UpdateWorkspaceDto} from './dto/update-workspace.dto';
import {operationsCodes} from "../utils/operation-codes";
import {JwtAuthGuard} from "../authentication/jwt-auth.guard";

@Controller('workspace')
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
    constructor(private readonly workspaceService: WorkspaceService) {
    }

    @Post()
    @UsePipes(ValidationPipe)
    create(@Req() req, @Body() createWorkspaceDto: CreateWorkspaceDto) {
        return this.workspaceService.createWorkspace(req.user, createWorkspaceDto.name);
    }


    @Delete()
    async removeWorkspace(@Req() req, @Res() res) {
        const response = await this.workspaceService.removeWorkspace(req?.body?.id, req.user);
        return res
            .status(operationsCodes.getResponseCode(response.code))
            .json(response);
    }


    @Get('/:id')
    async getWorkspaceDetails(@Param('id') id: string, @Res() res) {
        const response = await this.workspaceService.getWorkspaceDetails(id);
        return res
            .status(operationsCodes.getResponseCode(response.code))
            .json(response);
    }

    @Post('/invite-user')
    async inviteUserToWorkspace(@Req() req, @Res() res) {
        const response = await this.workspaceService.inviteUserToWorkspace(
            req.user,
            req.body.workspaceName,
            req.body.workspaceId,
            req.body.userEmail
        );
        return res.status(operationsCodes.getResponseCode(response.code)).json(response);
    }

    @Delete('/remove-user')
    async removeUserFromWorkspace(@Req() req, @Res() res) {
        const response = await this.workspaceService.removeUserFromWorkspace(req.user, req.body.workspaceId, req.body.userId);
        return res.status(operationsCodes.getResponseCode(response.code)).json(response);

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
