import {Global, Module} from '@nestjs/common';
import {AuthenticationService} from './authentication.service';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {ConfigService} from "../config/config.service";
import {ConfigModule} from "../config/config.module";

const factoryMethod = async (configService: ConfigService) => {
    return {
        secret: configService.get("JWTSECRETKey"),
        signOptions: {expiresIn: '60s'},
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
        AuthenticationService
    ],
    exports: [
        AuthenticationService
    ]
})
export class AuthenticationModule {
}
