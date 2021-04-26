import {Global, Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {USER_SCHEMA_NAME, UserSchema} from './entities/user';
import {AccountModule} from './account/account.module';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{name: USER_SCHEMA_NAME, schema: UserSchema}]),
        AccountModule,
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [
        MongooseModule.forFeature([{name: USER_SCHEMA_NAME, schema: UserSchema}]),
    ]
})
export class UserModule {
}
