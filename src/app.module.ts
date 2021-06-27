import { Controller, Get, Module, Req, Res } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { SpaceModule } from './space/space.module';
import { ListModule } from './list/list.module';
import { TaskModule } from './task/task.module';
import { RoleModule } from './role/role.module';
import { FileHandler } from './utils/file-system-handler';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { DatabaseModule } from '../libs/database';
import * as dotenv from 'dotenv';
dotenv.config();

@Controller()
class globalController {
  @Get()
  async getMainPage(@Req() req, @Res() res) {
    if (req.headers.host === 'nest-slark.herokuapp.com') {
      const verificationPage = await FileHandler.readFileAsync(
        'src/public/pages/landing-page.html',
      );
      res.writeHead(200, {
        'Content-Type': 'text/html',
      });
      res.write(verificationPage);
      res.end();
      return res.status(200).json({ message: 'App started successfully' });
    }
  }
}

const ENV = process.env.NODE_ENV;
console.log({ ENV });
@Module({
  controllers: [globalController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    DatabaseModule,
    AuthenticationModule,
    UserModule,
    WorkspaceModule,
    SpaceModule,
    ListModule,
    TaskModule,
    RoleModule,
  ],
})
export class AppModule {}
