import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMA_NAME, UserSchema } from './user';

@Module({
  imports: [MongooseModule.forFeature([{ name: SCHEMA_NAME, schema: UserSchema }])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {
}
