import {Global, Module} from '@nestjs/common';
import {AuthenticationService} from './authentication.service';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {ConfigService} from "../config/config.service";
import {ConfigModule} from "../config/config.module";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {JwtStrategy} from "./jwt-strategy";
import {UserModule} from "../user/user.module";
import {UserService} from "../user/user.service";

const factoryMethod = async (configService: ConfigService) => {
    return {
        secret: configService.get("JWTSECRETKey"),
        signOptions: {expiresIn: configService.get('EXPIRES_IN')}
    };
};

@Global()
@Module({
    imports: [
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: factoryMethod,
            inject: [ConfigService],
        }),
    ],
    providers: [
        AuthenticationService,
        JwtAuthGuard,
        JwtStrategy,
        UserService
    ],
    exports: [
        AuthenticationService,
        JwtAuthGuard
    ]
})
export class AuthenticationModule {
}
