import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Zone } from '../entities/zones.entity';
import { ZoneDto } from './dto/Zone.dto';
import { ZoneService } from './zone.service';


@Controller('zone')
export class ZoneController {
    constructor(private readonly zoneService: ZoneService) {}

    @Get()
    async findAll(): Promise<Zone[]> {
        return this.zoneService.find();
    }
    
    @Post ()
    async createZone(@Body() newZone:ZoneDto): Promise<Zone>{
        return await this.zoneService.create(newZone)
    }

    @Delete(':id')
    async remove(@Param('id') id: number){
        return await this.zoneService.deleteZone(id);
  }

  @Delete(':id/delivery/:deliveryId')
  removeDeliveryFromZone(@Param('id') zoneId: number,@Param('deliveryId') deliveryId: number) {
    return this.zoneService.removeDeliveryFromZone(zoneId, deliveryId);
  }

    @Put(':id')
    async updateZone(@Param('id') id: number, @Body() updatedZone : ZoneDto): Promise<Zone> {
        return await this.zoneService.updateZone(id, updatedZone);
    }

    @Get('zone/:id')
    async findById(@Param('id') id:number):Promise<Zone>{
        return await this.zoneService.findById(id)
    }
}
