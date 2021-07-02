import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MongoExceptionFilter } from '../filters/mongo-exception.filter';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import { SwaggerDocsInterface } from './configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter(), new MongoExceptionFilter());

  const swaggerDocs = configService.get<SwaggerDocsInterface>('swaggerDocs');
  3;
  const config = new DocumentBuilder()
    .setTitle(swaggerDocs.title)
    .setDescription(swaggerDocs.description)
    .setVersion(swaggerDocs.version)
    .addTag(swaggerDocs.tag)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  const PORT = configService.get<number>('PORT');
  await app.listen(PORT);
}

bootstrap().then();
