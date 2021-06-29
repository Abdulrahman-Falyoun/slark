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
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { UpdateListDto } from './dto/update-list.dto';

@Controller('list')
@UseGuards(JwtAuthGuard)
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async createList(
    @Res() res,
    @Req() req,
    @Body() createListDto: CreateListDto,
  ) {
    return this.listService.addList(createListDto);
  }

  @Delete('/:id')
  async deleteList(@Param('id') id: string, @Res() res) {
    return this.listService.deleteList(id);
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
}
