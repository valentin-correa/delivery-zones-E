import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Zone } from '../entities/zones.entity';
import { PartialUpdateZoneDto, ZoneDto } from './dto/Zone.dto';
import { ZoneService } from './zone.service';
import { Permissions } from 'src/middlewares/decorators/permissions.decorator';
import { PaginationDto } from 'src/common/dto/common.dto';
import { AuthGuard } from 'src/middlewares/auth.middleware';


@Controller('zone')
export class ZoneController {
    constructor(private readonly zoneService: ZoneService) {}

    @UseGuards(AuthGuard)
    @Permissions(['view-zone'])
    @Get() // GET /zone
    async findAll(@Query() pagination: PaginationDto): Promise<Zone[]> {
        return this.zoneService.find(pagination);
    }
    
    @UseGuards(AuthGuard)
    @Permissions(['create-zone'])
    @Post () // POST /zone
    async createZone(@Body() newZone:ZoneDto): Promise<Zone>{
        return await this.zoneService.create(newZone)
    }

    @UseGuards(AuthGuard)
    @Permissions(['delete-zone'])
    @Delete(':id') // DELETE /zone/:id
    async remove(@Param('id') id: number){
        return await this.zoneService.deleteZone(id);
    }

    @UseGuards(AuthGuard)
    @Permissions(['update-zone'])
    @Put(':id') // PUT /zone/:id
    async updateZone(@Param('id') id: number, @Body() updatedZone : ZoneDto): Promise<Zone> {
        return await this.zoneService.updateZone(id, updatedZone);
    }

    @UseGuards(AuthGuard)
    @Permissions(['view-zone'])
    @Get(':id') // GET /zone/:id
    async findById(@Param('id') id:number):Promise<Zone>{
        return await this.zoneService.findById(id)
    }

    //@UseGuards(AuthGuard)
    //@Permissions(['update-zone'])
    @Patch(':id') // PATCH /zone/:id
    async partialUpdate(@Param('id') id: number,@Body() updateData: PartialUpdateZoneDto): Promise<Zone> {
        return this.zoneService.partialUpdate(id, updateData);
    }
}
