import {Global, Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {USER_SCHEMA_NAME, UserSchema} from './entities/user';
import {AccountModule} from './account/account.module';
import {UserUtilsService} from "./user-utils.service";

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{name: USER_SCHEMA_NAME, schema: UserSchema}]),
        AccountModule,
    ],
    providers: [UserService, UserUtilsService],
    controllers: [UserController],
    exports: [
        MongooseModule.forFeature([{name: USER_SCHEMA_NAME, schema: UserSchema}]),
        UserUtilsService
    ]
})
export class UserModule {
}
