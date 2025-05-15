import { Body, Controller, Get, Param, Put, Query, Post, Delete } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import {Delivery} from '../entities/deliveries.entity'
import { FindByProximityDto, UpdateLocationDto } from './dto/delivery.dto';
import { CreateDeliveryDto } from './dto/delivery.dto';

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
    async assignZone(@Param('id') id: number, @Body('zoneIds') zoneIds: number[]): Promise<Delivery> { // Analizar si agregar DTO para una sola propiedad o no
        return await this.deliveryService.assignZone(id, zoneIds);
    }

    @Post()
    async createDelivery(@Body() newDelivery:CreateDeliveryDto) : Promise<Delivery>{
        return await this.deliveryService.createDelivery(newDelivery)
    }
    @Delete(':id')
    async deleteDelivery(@Param('id') id:number):Promise<{ message: string }>{
        return this.deliveryService.deleteDelivery(id)
    }
    
}