import {Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import {operationsCodes} from "../utils/operation-codes";
import {JwtAuthGuard} from "../authentication/jwt-auth.guard";

@Controller('list')
@UseGuards(JwtAuthGuard)
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async createList(@Res() res, @Req() req, @Body() createListDto: CreateListDto) {
    const response = await this.listService.addList(createListDto);
    return res
        .status(operationsCodes.getResponseCode(response.code))
        .json(response);
  }

  @Delete('/:id')
  async deleteList(@Param('id') id: string, @Res() res) {
    const response = await this.listService.deleteList(id);
    return res
        .status(operationsCodes.getResponseCode(response.code))
        .json(response);
  }

}
