import { Body, Controller, Get, Param, Put, Query, Post, Delete, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import {Delivery} from '../entities/deliveries.entity'
import { FindByProximityDto, FindByZoneDTO, UpdateDeliveryStatusDto, UpdateLocationDto } from './dto/delivery.dto';
import { CreateDeliveryDto, AssignZoneDto } from './dto/delivery.dto';
import { Zone } from 'src/entities/zones.entity';
import { PaginationDto } from 'src/common/dto/common.dto';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import { Permissions } from 'src/middlewares/decorators/permissions.decorator'; 

@Controller('delivery')
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) {}

    @UseGuards(AuthGuard)
    @Permissions(['view-delivery'])
    @Get('findByProximity') // GET /delivery/findByProximity
    async findByProximity(@Query() findByProximityDto: FindByProximityDto):Promise<Delivery[]>{
        return await this.deliveryService.findByProximity(findByProximityDto)
    }

    @UseGuards(AuthGuard)
    @Permissions(['view-delivery'])
    @Get('findByZone') // GET /delivery/findByZone
    async findByZone(@Query() zoneId: FindByZoneDTO):Promise<Delivery[]>{
        return await this.deliveryService.findByZone(zoneId);
    }

    @UseGuards(AuthGuard)
    @Permissions(['update-delivery'])
    @Put(':id/location') // PUT /delivery/:id/location
    async updateLocation(@Param('id') id: number, @Body() updateLocationDto: UpdateLocationDto): Promise<Delivery> {
        return await this.deliveryService.updateLocation(id, updateLocationDto);
    }

    @UseGuards(AuthGuard)
    @Permissions(['update-delivery'])
    @Post(':id/assignZone') // POST /delivery/:id/assignZone
    async assignZone(@Param('id') id: number, @Body() assignZoneDto: AssignZoneDto): Promise<Delivery> {
        return await this.deliveryService.assignZone(id, assignZoneDto);
    }

    @UseGuards(AuthGuard)
    @Permissions(['create-delivery'])
    @Post() // POST /delivery
    async createDelivery(@Body() newDelivery:CreateDeliveryDto) : Promise<Delivery>{
        return await this.deliveryService.createDelivery(newDelivery)
    }

    @UseGuards(AuthGuard)
    @Permissions(['delete-delivery'])
    @Delete(':id') // DELETE /delivery/:id
    async deleteDelivery(@Param('id') id:number):Promise<{ message: string }>{
        return await this.deliveryService.deleteDelivery(id)
    }

    //@UseGuards(AuthGuard)
    //@Permissions(['update-delivery'])
    @Delete(':id/zone/:zoneId') // DELETE /delivery/:id/zone/:zoneId
    async removeZoneFromDelivery(@Param('id') deliveryId: number,@Param('zoneId') zoneId: number) {
        return await this.deliveryService.removeZoneFromDelivery(deliveryId, zoneId);
    }

    @UseGuards(AuthGuard)
    @Permissions(['view-delivery'])
    @Get(':id/zones') // GET /delivery/:id/zones
    async getZonesByDelivery(@Param('id') id: number,@Query() pagination: PaginationDto) : Promise<Zone[]>{
      return this.deliveryService.findZonesByDeliveryId(id, pagination);
    }

    @UseGuards(AuthGuard)
    @Permissions(['update-delivery'])
    @Put(':id/status') // PUT /delivery/:id/status
    async updateStatus(@Param(':id') id: number, @Body() updatedStatus: UpdateDeliveryStatusDto): Promise<Delivery> {
        return await this.deliveryService.updateStatus(id, updatedStatus);
    }
}