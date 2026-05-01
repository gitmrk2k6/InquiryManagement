import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { InquiryModule } from './inquiry/inquiry.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'inquiry-create',
        ttl: 60_000,
        limit: 5,
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USERNAME ?? 'app',
      password: process.env.DB_PASSWORD ?? 'password',
      database: process.env.DB_DATABASE ?? 'inquiry_management',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    InquiryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
