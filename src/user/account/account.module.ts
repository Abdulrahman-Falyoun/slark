import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { UserService } from '../user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user.model';
import { SLARK_USER } from '../../utils/schema-names';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SLARK_USER, schema: UserSchema }]),
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    {
      provide: UserService,
      useClass: UserService,
    },
  ],
})
export class AccountModule {}
