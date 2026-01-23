import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function swaggerConfig(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Teashop api')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    swaggerOptions: {
      docExpansion: 'none', // This collapses all by default
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}
