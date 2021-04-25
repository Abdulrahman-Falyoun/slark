import {Controller, Get, Post, Body, Patch, Param, Delete, Res, ValidationPipe, UsePipes} from '@nestjs/common';
import {AccountService} from './account.service';
import {SignupDto} from "./dto/signup.dto";
import {LoginDto} from "./dto/login.dto";

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {
    }

    @Post('/signup')
    @UsePipes(ValidationPipe)
    async signup(@Res() res, @Body() signUpDto: SignupDto) {
        const createdUser = await this.accountService.signup(signUpDto);
        return res.status(200).json(createdUser);
    }


    @Post('/login')
    @UsePipes(ValidationPipe)
    async login(@Res() res, @Body() loginDto: LoginDto) {
        const user = await this.accountService.login(loginDto);
        return res.status(200).json(user);
    }
}
