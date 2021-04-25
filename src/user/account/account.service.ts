import {Injectable} from '@nestjs/common';
import {UserService} from "../user.service";
import {SignupDto} from "./dto/signup.dto";
import {LoginDto} from "./dto/login.dto";
import * as bcrypt from 'bcrypt';
import {AuthenticationService} from "../../authentication/authentication.service";

@Injectable()
export class AccountService {
    constructor(private userService: UserService, private authenticationService: AuthenticationService) {
    }


    signup(signUpDto: SignupDto) {
        return this.userService.create(signUpDto);
    }

    async login(loginDto: LoginDto) {
        const user = await this.userService.findOne(null, loginDto.email);
        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) {
            return {
                message: 'Password is not correct'
            }
        }
        return {
            _id: user._id,
            email: user.email,
            name: user.name,
            token: `Bearer ${this.authenticationService.generateAccessToken(user)}`
        };
    }

}
