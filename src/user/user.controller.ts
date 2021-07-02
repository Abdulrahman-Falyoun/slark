import { Controller, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Delete(':id')
  deleteUser(@Req() req, @Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
