import {Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/entities/user";


@Injectable()
export class AuthenticationService {
    constructor(
        private jwtService: JwtService
    ) {
    }

    async validateUser(username: string, pass: string): Promise<any> {
        // const user = await this.usersService.findOne(username);
        // if (user && user.password === pass) {
        //     const { password, ...result } = user;
        //     return result;
        // }
        // return null;
    }

    generateAccessToken(user: User) {
        return this.jwtService.sign({email: user.email, id: user.id});
    }
}
