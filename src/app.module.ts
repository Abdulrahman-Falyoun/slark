import {Module} from '@nestjs/common';
import {MongooseInitializerModule} from './mongoose/mongoose-initializer.module';
import {ConfigModule} from './config/config.module';
import {MailModule} from './mail/mail.module';
import {AuthenticationModule} from './authentication/authentication.module';
import {UserModule} from './user/user.module';
import {WorkspaceModule} from './workspace/workspace.module';
import {SpaceModule} from './space/space.module';
import {ListModule} from './list/list.module';
import {TaskModule} from './task/task.module';
import { RoleModule } from './role/role.module';

@Module({
    imports: [
        ConfigModule.register({folder: 'config'}),
        MongooseInitializerModule,
        MailModule,
        AuthenticationModule,
        UserModule,
        WorkspaceModule,
        SpaceModule,
        ListModule,
        TaskModule,
        RoleModule,
    ],

})
export class AppModule {
}
