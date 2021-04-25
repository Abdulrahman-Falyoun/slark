import {Module} from '@nestjs/common';
import {AccountService} from './account.service';
import {AccountController} from './account.controller';
import {UserService} from "../user.service";
import {MongooseModule} from "@nestjs/mongoose";
import {SCHEMA_NAME, UserSchema} from "../entities/user";

@Module({
    imports: [
        MongooseModule.forFeature([{name: SCHEMA_NAME, schema: UserSchema}]),
    ],
    controllers: [AccountController],
    providers: [AccountService,
        {
            provide: UserService,
            useClass: UserService
        }
    ]
})
export class AccountModule {
}
