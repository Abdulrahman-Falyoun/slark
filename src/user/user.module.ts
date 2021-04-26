import {Global, Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {UserSchema} from './entities/user';
import {AccountModule} from './account/account.module';
import {UserUtilsService} from "./user-utils.service";
import {SLARK_USER} from "../utils/schema-names";

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{name: SLARK_USER, schema: UserSchema}]),
        AccountModule,
    ],
    providers: [UserService, UserUtilsService],
    controllers: [UserController],
    exports: [
        MongooseModule.forFeature([{name: SLARK_USER, schema: UserSchema}]),
        UserUtilsService,
        UserService
    ]
})
export class UserModule {
}
