import {
  Controller,
  Delete,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Delete()
  deleteUser(@Req() req, @Res() res) {
    return this.userService.deleteUser(req.body);
  }

  @Get('/in-workspace/:id/all')
  public getAllUsersInWorkspace(@Param('id') id: string, @Res() res) {
    return this.userService.getAllInWorkspace(id);
  }
}
