import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
// import { AppService } from './app.service'; puede ser que esto está de más?
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities/index';
import { DeliveryService } from './delivery/delivery.service';
import { ZoneService } from './zone/zone.service';
import { ZoneController } from './zone/zone.controller';
import { DeliveryController } from './delivery/delivery.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        database: 'asd',
        username: 'asd',
        password: '123',
        synchronize: true,
        entities,
    }),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [AppController, ZoneController, DeliveryController],
  providers: [ DeliveryService, ZoneService], 
})
export class AppModule {}
//le saque el AppService