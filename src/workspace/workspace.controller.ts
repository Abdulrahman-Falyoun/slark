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
  UseGuards,
  Query,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Workspace')
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  create(@Req() req, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.createWorkspace(req.user, createWorkspaceDto);
  }

  @Post('/invite-user')
  @UseGuards(JwtAuthGuard)
  inviteUserToWorkspace(
    @Req() req,
    @Body() payload: { workspaceId: string; userEmail: string },
  ) {
    return this.workspaceService.inviteUserToWorkspace(
      req.user,
      payload.workspaceId,
      payload.userEmail,
    );
  }

  @Delete('/remove-user')
  @UseGuards(JwtAuthGuard)
  removeUserFromWorkspace(
    @Req() req,
    @Body() { workspaceId, userEmail }: { workspaceId: string; userEmail: string },
  ) {
    return this.workspaceService.removeUserFromWorkspace(
      req.user,
      workspaceId,
      userEmail,
    );
  }

  @Get('/join-workspace/:workspaceId/:email/:token')
  async addUserToWorkspace(
    @Param('workspaceId') workspaceId: string,
    @Param('email') email: string,
    @Param('token') token: string,
  ) {
    return this.workspaceService.addUserToWorkspace(workspaceId, email);
  }
  @Get('/all-users')
  public getAllUsersInWorkspace(@Query('workspace') id: string) {
    return this.workspaceService.getAllUsersInWorkspace(id);
  }
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  removeWorkspace(@Param('id') id: string, @Req() req) {
    return this.workspaceService.removeWorkspace(id, req.user);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getWorkspaceDetails(@Param('id') id: string) {
    return this.workspaceService.findOne({ _id: id });
  }
}
