import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import validationConfig from './config/validation.config';
import swaggerConfig from './config/swagger.config';

import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  validationConfig(app);
  swaggerConfig(app);
  app.use(cookieParser());
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://example.com'
        : process.env.CLIENT_URL_DEVELOPMENT,
    credentials: true,
    exposeHeaders: ['set-cookie'],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
});
