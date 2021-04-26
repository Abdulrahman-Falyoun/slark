import {
    Controller,
    Post,
    Body,
    Param,
    Res,
    ValidationPipe,
    UsePipes, Get,
} from '@nestjs/common';
import {AccountService} from './account.service';
import {SignupDto} from "./dto/signup.dto";
import {LoginDto} from "./dto/login.dto";
import {FileHandler} from "../../utils/file-system-handler";
import {operationsCodes} from "../../utils/operation-codes";

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


    @Get('/verify/:email/:token')
    async verifyAccount(@Res() res, @Param('email') email: string, @Param('token') token: string) {
        await this.accountService.confirmEmail(email, token);
        const verificationPage = await FileHandler.readFileAsync(
            "src/public/pages/verification-page.html"
        );
        res.writeHead(200, {
            "Content-Type": "text/html",
        });
        res.write(verificationPage);
        res.end();
    }

    @Get('/reactivate/:email')
    async resendActivationLink(@Param('email') email: string, @Res() res) {
        const response = await this.accountService.resendActivationLink(email);
        return res
            .status(operationsCodes.getResponseCode(response.code))
            .json(response);
    }
}
