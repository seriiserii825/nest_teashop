import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import validationConfig from './config/validation.confit';
import swaggerConfig from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  validationConfig(app);
  swaggerConfig(app);
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? 'https://example.com' : '*',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
