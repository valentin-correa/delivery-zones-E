import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities/index';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'postgres',
        hots: 'localhost',
        database: 'asd',
        username: 'asd',
        password: '123',
        synchronize: true,
        entities,
    }),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
