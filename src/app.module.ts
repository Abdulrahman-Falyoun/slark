import {Controller, Get, Module, Req, Res} from '@nestjs/common';
import {MongooseInitializerModule} from './mongoose/mongoose-initializer.module';
import {ConfigModule} from './config/config.module';
import {MailModule} from './mail/mail.module';
import {AuthenticationModule} from './authentication/authentication.module';
import {UserModule} from './user/user.module';
import {WorkspaceModule} from './workspace/workspace.module';
import {SpaceModule} from './space/space.module';
import {ListModule} from './list/list.module';
import {TaskModule} from './task/task.module';
import {RoleModule} from './role/role.module';
import {FileHandler} from "./utils/file-system-handler";

@Controller()
class globalController {
    @Get()
    async getMainPage(@Req() req, @Res() res) {
        if (req.headers.host === "nest-slark.herokuapp.com") {
            const verificationPage = await FileHandler.readFileAsync(
                "src/public/pages/landing-page.html"
            );
            res.writeHead(200, {
                "Content-Type": "text/html",
            });
            res.write(verificationPage);
            res.end();
            return res.status(200).json({message: "App started successfully"});
        }
    }
}

@Module({
    controllers: [
        globalController
    ],
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
