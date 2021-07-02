import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Req,
  UseGuards,
  Put,
  Query,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { WorkspaceService } from '../workspace/workspace.service';
import { GetAllSpacesDto } from './dto/get-all-spaces.dto';

@Controller('spaces')
@UseGuards(JwtAuthGuard)
export class SpaceController {
  constructor(
    private readonly spaceService: SpaceService,
    @Inject(forwardRef(() => WorkspaceService))
    private workspaceService: WorkspaceService,
  ) {}

  @Post()
  create(@Req() req, @Body() createSpaceDto: CreateSpaceDto) {
    return this.spaceService.createSpace(req.user.id, createSpaceDto);
  }

  @Delete(':id')
  removeSpace(
    @Req() req,
    @Param('id') id: string,
    @Query('workspace') workspaceId: string,
  ) {
    return this.spaceService.deleteSpace(req.user, id, workspaceId);
  }

  @Put(':id')
  async updateSpace(
    @Req() req,
    @Param('id') id: string,
    @Body() updateSpaceDto: any,
  ) {
    let w;
    if ('_workspace' in updateSpaceDto) {
      w = await this.workspaceService.findOne({
        _id: updateSpaceDto._workspace,
      });
    }
    return this.spaceService.updateSpace(
      {
        _id: id,
      },
      {
        $set: w ? { ...updateSpaceDto, _workspace: w._id } : updateSpaceDto,
      },
    );
  }

  @Get(':id')
  getSpaceDetails(@Param('id') id: string) {
    return this.spaceService.findOne({ _id: id });
  }

  @Get()
  getAllSpaces(@Query() query: GetAllSpacesDto) {
    return this.spaceService.findAll(query);
  }
}
