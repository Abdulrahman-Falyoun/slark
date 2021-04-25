import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {AuthenticationService} from "./authentication.service";
import {ConfigService} from "../config/config.service";
import {UserService} from "../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authenticationService: AuthenticationService,
        private configService: ConfigService,
        private userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get("JWTSECRETKey"),
            ignoreExpiration: false,
        });
    }

    async validate(payload: { email: string, id: string, expiresIn: any }) {
        const user = await this.userService.findOne(payload.id);
        if (!user) {
            throw new HttpException('User does not exist', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }
}