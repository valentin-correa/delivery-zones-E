import { Controller, Get } from '@nestjs/common';
import { ZoneService } from './zone.service'
import { Zone } from '../entities/zones.entity'

@Controller('zones')
export class ZoneController {
    constructor(private readonly zoneService: ZoneService) {}

    @Get()
    async findAll(): Promise<Zone[]> {
        return this.zoneService.find();
    }
}
