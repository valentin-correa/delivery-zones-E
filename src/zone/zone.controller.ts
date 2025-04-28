import { Body, Controller, Post, Get } from '@nestjs/common';
import { ZoneService } from './zone.service';
import {Zone} from '../entities/zones.entity';


@Controller('zone')
export class ZoneController {
    constructor(private readonly zoneService: ZoneService) {}

    @Post ()
    async createZone(@Body() newZone:{name:string,location:{lat:number,lng:number},radius:number}): Promise<Zone>{
        return await this.zoneService.create(newZone)
    }
    
}
