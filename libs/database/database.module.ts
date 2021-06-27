import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { DBConfig } from '../../src/configuration';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const dbConfig = configService.get<DBConfig>('db');
        return {
          uri: dbConfig.DATABASE_URL,
          replicaSet: dbConfig.REPLICA_SET,
          useNewUrlParser: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
