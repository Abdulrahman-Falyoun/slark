import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { AccountModule } from './account/account.module';
import { SLARK_USER } from '../utils/schema-names';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: SLARK_USER, schema: UserSchema }]),
    AccountModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [
    MongooseModule.forFeature([{ name: SLARK_USER, schema: UserSchema }]),
    UserService,
  ],
})
export class UserModule {}
