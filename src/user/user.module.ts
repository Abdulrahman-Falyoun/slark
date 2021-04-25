import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {SCHEMA_NAME, UserSchema} from './entities/user';
import { AccountModule } from './account/account.module';

@Module({
    imports: [
        MongooseModule.forFeature([{name: SCHEMA_NAME, schema: UserSchema}]),
        AccountModule,
    ],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {
}
