import { Body, Controller, Get, Param, Put, Query, Post } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import {Delivery} from '../entities/deliveries.entity'

@Controller('delivery')
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) {}

    @Get('findByProximity')
    async findByProximity(@Query('lat') lat: number,@Query('lng') lng: number,@Query('radius') radius: number):Promise<Delivery[]>{
        return await this.deliveryService.findByProximity(lat,lng,radius)
    }

    @Get('findByZone')
    async findByZone(@Query('zoneId') zoneId: number):Promise<Delivery[]>{
        return await this.deliveryService.findByZone(zoneId);
    }

    @Put (':id/location')
    async updateLocation(@Param('id') id:number,@Body('location') location:{lat:number,lng:number}): Promise<Delivery>{
        return await this.deliveryService.updateLocation(id, location)
    }

    @Post(':id/assignZone')
    async assignZone(@Param('id') id: number, @Body('zoneIds') zoneIds: number[]): Promise<Delivery> {
        return await this.deliveryService.assignZone(id, zoneIds);
    }

    @Post()
    async createDelivery(@Body() newDelivery:{personId:number,location:{lat:number,lng:number},radius:number}) : Promise<Delivery>{
        return await this.deliveryService.createDelivery(newDelivery)
    }
    
}