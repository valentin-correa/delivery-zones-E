import { Body, Controller, Get, Param, Put, Query, Post } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import {Delivery} from '../entities/deliveries.entity'
import { FindByProximityDto, UpdateLocationDto } from './dto/updateLocation.dto';
import { CreateDeliveryDto } from './dto/createDelivery.dto';

@Controller('delivery')
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) {}

    @Get('findByProximity')
    async findByProximity(@Query() findByProximityDto: FindByProximityDto):Promise<Delivery[]>{
        return await this.deliveryService.findByProximity(findByProximityDto)
    }

    @Get('findByZone')
    async findByZone(@Query('zoneId') zoneId: number):Promise<Delivery[]>{
        return await this.deliveryService.findByZone(zoneId);
    }

    @Put(':id/location')
    async updateLocation(@Param('id') id: number, @Body() updateLocationDto: UpdateLocationDto): Promise<Delivery> {
        return await this.deliveryService.updateLocation(id, updateLocationDto);
    }

    @Post(':id/assignZone')
    async assignZone(@Param('id') id: number, @Body('zoneIds') zoneIds: number[]): Promise<Delivery> {
        return await this.deliveryService.assignZone(id, zoneIds);
    }

    @Post()
    async createDelivery(@Body() newDelivery:CreateDeliveryDto) : Promise<Delivery>{
        return await this.deliveryService.createDelivery(newDelivery)
    }
    
}