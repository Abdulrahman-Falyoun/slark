import {
  Controller,
  Post,
  Body,
  Param,
  Res,
  ValidationPipe,
  UsePipes,
  Get,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { FileHandler } from '../../utils/file-system-handler';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signup(@Body() signUpDto: SignupDto) {
    return this.accountService.signup(signUpDto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  login(@Body() loginDto: LoginDto) {
    return this.accountService.login(loginDto);
  }

  @Get('/verify/:email/:token')
  async verifyAccount(
    @Res() res,
    @Param('email') email: string,
    @Param('token') token: string,
  ) {
    await this.accountService.confirmEmail(email, token);
    const verificationPage = await FileHandler.readFileAsync(
      'src/public/pages/verification-page.html',
    );
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.write(verificationPage);
    res.end();
  }

  @Get('/reactivate/:email')
  resendActivationLink(@Param('email') email: string, @Res() res) {
    return this.accountService.resendActivationLink(email);
  }
}
