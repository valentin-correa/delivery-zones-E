import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import {Delivery} from '../entities/deliveries.entity'

@Controller('delivery')
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) {}

    @Get('findByProximity')
    async findByProximity(@Query('lat') lat: number,@Query('lng') lng: number,@Query('radius') radius: number):Promise<Delivery[]>{
        return await this.deliveryService.findByProximity(lat,lng,radius)
    }

    @Put (':id/location')
    async updateLocation(@Param('id') id:number,@Body() location:{lat:number,lng:number}): Promise<Delivery>{
        return await this.deliveryService.updateLocation(id, location)
    }
    
}