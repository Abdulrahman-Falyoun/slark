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
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';

@Controller('space')
@UseGuards(JwtAuthGuard)
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  create(@Res() res, @Req() req, @Body() createSpaceDto: CreateSpaceDto) {
    return this.spaceService.createSpace(req.user.id, createSpaceDto);
  }

  @Delete()
  removeSpace(@Res() res, @Req() req) {
    return this.spaceService.deleteSpace(
      req.user,
      req?.body?.id,
      req?.body?.workspaceId,
    );
  }

  @Put()
  updateSpace(@Res() res, @Req() req) {
    return this.spaceService.updateSpaceByAdmin(
      req?.body?.id,
      req?.body?.workspaceId,
      req.user,
      {
        $set: req?.body?.data,
      },
    );
  }

  @Get('/:id')
  getSpaceDetails(@Res() res, @Param('id') id: string) {
    return this.spaceService.getSpaceDetails(id);
  }
}
