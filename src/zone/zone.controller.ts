import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { Zone } from '../entities/zones.entity';
import { PartialUpdateZoneDto, ZoneDto } from './dto/zone.dto';
import { ZoneService } from './zone.service';


@Controller('zone')
export class ZoneController {
    constructor(private readonly zoneService: ZoneService) {}

    @Get() // GET /zone
    async findAll(): Promise<Zone[]> {
        return this.zoneService.find();
    }
    
    @Post () // POST /zone
    async createZone(@Body() newZone:ZoneDto): Promise<Zone>{
        return await this.zoneService.create(newZone)
    }

    @Delete(':id') // DELETE /zone/:id
    async remove(@Param('id') id: number){
        return await this.zoneService.deleteZone(id);
    }

    @Put(':id') // PUT /zone/:id
    async updateZone(@Param('id') id: number, @Body() updatedZone : ZoneDto): Promise<Zone> {
        return await this.zoneService.updateZone(id, updatedZone);
    }

    @Get(':id') // GET /zone/:id
    async findById(@Param('id') id:number):Promise<Zone>{
        return await this.zoneService.findById(id)
    }
    @Patch(':id') // PATCH /zone/:id
    async partialUpdate(@Param('id') id: number,@Body() updateData: PartialUpdateZoneDto): Promise<Zone> {
        return this.zoneService.partialUpdate(id, updateData);
    }
}
