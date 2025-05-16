import { Body, Controller, Get, Param, Put, Query, Post, Delete } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import {Delivery} from '../entities/deliveries.entity'
import { FindByProximityDto, FindByZoneDTO, UpdateDeliveryStatusDto, UpdateLocationDto } from './dto/delivery.dto';
import { CreateDeliveryDto, AssignZoneDto } from './dto/delivery.dto';
import { Zone } from 'src/entities/zones.entity';

@Controller('delivery')
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) {}

    @Get('findByProximity') // GET /delivery/findByProximity
    async findByProximity(@Query() findByProximityDto: FindByProximityDto):Promise<Delivery[]>{
        return await this.deliveryService.findByProximity(findByProximityDto)
    }

    @Get('findByZone') // GET /delivery/findByZone
    async findByZone(@Query() zoneId: FindByZoneDTO):Promise<Delivery[]>{
        return await this.deliveryService.findByZone(zoneId);
    }

    @Put(':id/location') // PUT /delivery/:id/location
    async updateLocation(@Param('id') id: number, @Body() updateLocationDto: UpdateLocationDto): Promise<Delivery> {
        return await this.deliveryService.updateLocation(id, updateLocationDto);
    }

    @Post(':id/assignZone') // POST /delivery/:id/assignZone
    async assignZone(@Param('id') id: number, @Body() assignZoneDto: AssignZoneDto): Promise<Delivery> {
        return await this.deliveryService.assignZone(id, assignZoneDto);
    }

    @Post() // POST /delivery
    async createDelivery(@Body() newDelivery:CreateDeliveryDto) : Promise<Delivery>{
        return await this.deliveryService.createDelivery(newDelivery)
    }

    @Delete(':id') // DELETE /delivery/:id
    async deleteDelivery(@Param('id') id:number):Promise<{ message: string }>{
        return await this.deliveryService.deleteDelivery(id)
    }

    @Delete(':id/zone/:zoneId') // DELETE /delivery/:id/zone/:zoneId
    async removeZoneFromDelivery(@Param('id') deliveryId: number,@Param('zoneId') zoneId: number) {
        return await this.deliveryService.removeZoneFromDelivery(zoneId, deliveryId);
    }
    
    @Get(':id/zones') // GET /delivery/:id/zones
    async getZonesByDelivery(@Param('id') id: number,) : Promise<Zone[]>{
      return this.deliveryService.findZonesByDeliveryId(id);
    }
    @Put(':id/status') // PUT /delivery/:id/status
    async updateStatus(@Param(':id') id: number, @Body() updatedStatus: UpdateDeliveryStatusDto): Promise<Delivery> {
        return await this.deliveryService.updateStatus(id, updatedStatus);
    }
}