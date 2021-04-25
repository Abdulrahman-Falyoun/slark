import * as fs from 'fs';
import * as path from "path";
import * as dotenv from 'dotenv';
import { DotenvParseOutput } from 'dotenv';
import { Inject, Injectable } from '@nestjs/common';
interface EnvConfig extends DotenvParseOutput {
  DATABASE_URL: string;
  PORT: string;
  JWTSECRETKey: string;
  GMAIL_ACCOUNT: string;
  GMAIL_PASSWORD: string;
  REPLICA_SET?: string;
  MONGO_USER?: string;
  MONGO_PASSWORD?: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(@Inject('CONFIG_OPTIONS') private options) {
    const filePath = `${process.env.NODE_ENV || 'development'}.env`;
    const envFile = path.resolve(__dirname, '../../src', options.folder, filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile)) as EnvConfig;
  }

  get(key: keyof EnvConfig): string {
    return this.envConfig[key];
  }
}
