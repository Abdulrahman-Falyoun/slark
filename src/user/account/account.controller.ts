import {Controller, Get, Post, Body, Patch, Param, Delete, Res, ValidationPipe, UsePipes} from '@nestjs/common';
import {AccountService} from './account.service';
import {SignupDto} from "./dto/signup.dto";

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {
    }

    @Post('/signup')
    @UsePipes(ValidationPipe)
    async signUp(@Res() res, @Body() signUpDto: SignupDto) {
        const createdUser = await this.accountService.signUp(signUpDto);
        return res.status(200).json(createdUser);
    }
}
