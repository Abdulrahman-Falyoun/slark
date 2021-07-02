import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { UpdateListDto } from './dto/update-list.dto';
import { GetListsDto } from './dto/get-lists.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('List')
@Controller('lists')
@UseGuards(JwtAuthGuard)
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async createList(@Req() req, @Body() createListDto: CreateListDto) {
    return this.listService.addList(createListDto);
  }

  @Delete('/:id')
  async deleteList(@Param('id') id: string) {
    return this.listService.deleteList({ _id: id });
  }

  @Get('/:id')
  getList(@Param('id') id: string) {
    return this.listService.findList({
      _id: id,
    });
  }

  @Put('/:id')
  updateList(@Param('id') id: string, @Body() updateDto: UpdateListDto) {
    return this.listService.updateList(
      {
        _id: id,
      },
      updateDto,
    );
  }

  @Get()
  getAllLists(@Query() getListsDto: GetListsDto) {
    return this.listService.findAllLists(getListsDto);
  }
}
