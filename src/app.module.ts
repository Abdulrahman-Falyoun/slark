import {Module} from '@nestjs/common';
import {MongooseInitializerModule} from './mongoose/mongoose-initializer.module';
import {ConfigModule} from './config/config.module';
import {MailModule} from './mail/mail.module';
import {AuthenticationModule} from './authentication/authentication.module';
import {UserModule} from './user/user.module';

@Module({
    imports: [
        ConfigModule.register({folder: 'config'}),
        MongooseInitializerModule,
        MailModule,
        AuthenticationModule,
        UserModule,
    ],

})
export class AppModule {
}
