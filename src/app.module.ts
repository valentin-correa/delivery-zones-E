import { Module } from '@nestjs/common';
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
        database: 'postgres',
        username: 'postgres',
        password: 'postgres',
        port: 5432,
        synchronize: true,
        entities,
    }),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [ ZoneController, DeliveryController],
  providers: [ DeliveryService, ZoneService], 
})
export class AppModule {}
