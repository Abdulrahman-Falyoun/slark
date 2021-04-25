import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Global()
@Module({})
export class ConfigModule {
  static register(options): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        ConfigService,
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
      ],
      exports: [ConfigService],
    };
  }
}
