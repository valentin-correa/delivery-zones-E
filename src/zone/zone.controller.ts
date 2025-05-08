import { Body, Controller, Post, Get, Delete, Put, Param } from '@nestjs/common';
import { ZoneService } from './zone.service';
import {Zone} from '../entities/zones.entity';
import { CreateZoneDto } from './dto/createZone.dto';


@Controller('zone')
export class ZoneController {
    constructor(private readonly zoneService: ZoneService) {}

    @Get()
    async findAll(): Promise<Zone[]> {
        return this.zoneService.find();
    }

    @Post ()
    async createZone(@Body() newZone:CreateZoneDto): Promise<Zone>{
        return await this.zoneService.create(newZone)
    }

    @Delete(':id')
    async remove(@Param('id') id: number){
        return await this.zoneService.deleteZone(id);
  }

    @Put(':id')
    async updateZone(@Param('id') id: number, @Body() updatedZone : {name: string, location: {lat: number, lng: number}, radius: number}): Promise<Zone> {
        return await this.zoneService.updateZone(id, updatedZone);
    }

    
}
