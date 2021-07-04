import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Delete(':id')
  deleteUser(@Req() req, @Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.findOne({
      _id: id,
    });
  }
}
