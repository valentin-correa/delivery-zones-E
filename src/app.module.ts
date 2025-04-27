import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities/index';
import { DeliveryService } from './delivery/delivery.service';
import { ZoneService } from './zone/zone.service';

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
  providers: [AppService, DeliveryService, ZoneService],
})
export class AppModule {}
