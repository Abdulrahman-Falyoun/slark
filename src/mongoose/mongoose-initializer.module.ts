import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

const factoryMethod = async (configService: ConfigService) => {
  return {
    uri: configService.get('DATABASE_URL'),
    replicaSet: configService.get('REPLICA_SET'),
    useNewUrlParser: true,
  };
};

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule.register({ folder: 'config' })],
      useFactory: factoryMethod,
      inject: [ConfigService],
    }),
  ],
})
export class MongooseInitializerModule {
}
