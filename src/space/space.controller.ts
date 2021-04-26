import {Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UseGuards, Put} from '@nestjs/common';
import {SpaceService} from './space.service';
import {CreateSpaceDto} from './dto/create-space.dto';
import {operationsCodes} from "../utils/operation-codes";
import {User} from "../user/entities/user";
import {JwtAuthGuard} from "../authentication/jwt-auth.guard";

@Controller('space')
@UseGuards(JwtAuthGuard)
export class SpaceController {
    constructor(private readonly spaceService: SpaceService) {
    }

    @Post()
    async create(@Res() res, @Req() req, @Body() createSpaceDto: CreateSpaceDto) {
        const response = await this.spaceService.createSpace(req.user.id, createSpaceDto);
        return res
            .status(operationsCodes.getResponseCode(response.code))
            .json(response);
    }


    @Delete()
    async removeSpace(@Res() res, @Req() req,) {
        const response = await this.spaceService.deleteSpace(
            req.user,
            req?.body?.id,
            req?.body?.workspaceId
        );
        return res
            .status(operationsCodes.getResponseCode(response.code))
            .json(response);
    }

    @Put()
    async updateSpace(@Res() res, @Req() req,) {
        const response = await this.spaceService.updateSpaceByAdmin(
            req?.body?.id,
            req?.body?.workspaceId,
            req.user,
            {
                $set: req?.body?.data,
            }
        );
        return res
            .status(operationsCodes.getResponseCode(response.code))
            .json(response);
    }

    @Get('/:id')
    async getSpaceDetails(@Res() res, @Param('id') id: string) {
        const response = await this.spaceService.getSpaceDetails(id);
        return res
            .status(operationsCodes.getResponseCode(response.code))
            .json(response);
    }

}
