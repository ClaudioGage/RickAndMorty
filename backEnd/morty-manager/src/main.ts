import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  if (process.env.BYPASS_AUTH === 'true') {
    console.log('AUTH BYPASS ENABLED');
    app.use((req, res, next) => {
      req.user = { 
        id: 1, 
        sub: 1,
        username: 'testuser', 
        email: 'test@test.com' 
      };
      next();
    });
  }

  await app.listen(3007);
  console.log(`Application is running on: http://localhost:3007`);
}
bootstrap();
