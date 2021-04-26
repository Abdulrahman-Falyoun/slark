import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Query, Req,
    Res, UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import {UserService} from './user.service';
import {operationsCodes} from "../utils/operation-codes";
import {JwtAuthGuard} from "../authentication/jwt-auth.guard";

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private userService: UserService) {
    }
    @Delete()
    async deleteUser(@Req() req, @Res() res) {
        const response = await this.userService.deleteUser(req.body);
        return res.status(operationsCodes.getResponseCode(response.code)).json(response);
    }

    @Get('/in-workspace/:id/all')
    public async getAllUsersInWorkspace(@Param('id') id: string, @Res() res) {
        const response = await this.userService.getAllInWorkspace(id);
        return res.status(operationsCodes.getResponseCode(response.code)).json(response);
    }
}
