import { Body, Controller, Post, Get, Delete, Param } from '@nestjs/common';
import { ZoneService } from './zone.service';
import {Zone} from '../entities/zones.entity';


@Controller('zone')
export class ZoneController {
    constructor(private readonly zoneService: ZoneService) {}

    @Get()
    async findAll(): Promise<Zone[]> {
        return this.zoneService.find();
    }

    @Post ()
    async createZone(@Body() newZone:{name:string,location:{lat:number,lng:number},radius:number}): Promise<Zone>{
        return await this.zoneService.create(newZone)
    }

    @Delete(':id')
    async remove(@Param('id') id: number){
        return `This action removes cat with ID ${id}`;
  }
}
