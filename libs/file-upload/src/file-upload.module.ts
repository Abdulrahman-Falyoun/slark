import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadController } from './file-upload.controller';
import { pathToUploadedFiles } from './constants';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from './file.model';
import { FileUploadService } from './file-upload.service';
import { ConfigModule } from '@nestjs/config';
import configurations from './configurations';
import { DatabaseModule } from '../../database';
import { SLARK_FILE } from '../../../src/utils/schema-names';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configurations],
    }),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: pathToUploadedFiles,
      }),
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      {
        name: SLARK_FILE,
        schema: FileSchema,
      },
    ]),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
