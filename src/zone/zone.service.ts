import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from '../entities/zones.entity';
import { PartialUpdateZoneDto, ZoneDto } from './dto/zone.dto';
import { PaginationDto } from 'src/common/dto/common.dto';
import { take } from 'rxjs';

@Injectable()
export class ZoneService {
  constructor(@InjectRepository(Zone) private repository: Repository<Zone>) { }
  
    async find(pagination: PaginationDto):Promise<Zone[]> {
        const offset = this.calculateOffset(pagination.page, pagination.quantity)
        return await this.repository.find({
            skip: offset,
            take: pagination.quantity
    });
    }
    async create(newZone:ZoneDto): Promise<Zone>{
        const zone=this.repository.create(newZone);
        await this.repository.save(zone);
        return zone
    }

    async updateZone(id: number, updateZone: ZoneDto): Promise<Zone> {
        const zone = await this.repository.findOne( {where: {id} });

        if (!zone) {
            throw new NotFoundException(`Zone with id ${id} not found`);
        }

        Object.assign(zone, updateZone); // Este método se encarga de asignarle al objeto `zone`, definido al principio de la función, las propiedades del objeto `updateZone`

        await this.repository.save(zone);
        return zone;
    }

    async deleteZone(id: number) {
        const zone = await this.repository.findOne({where: {id}});

        if (zone) {
            await this.repository.remove(zone);
        }
        else throw new NotFoundException(`Zone with id ${id} not found`);
        
        return { message: "Zone deleted" }
    }
    async findById(id:number):Promise<Zone>{
        const zone = await this.repository.findOne({ where: { id } });
        if (!zone) {
            throw new NotFoundException(`Zone with id ${id} not found`);
        }
        return zone;
    }
    

    async findZonesById(zoneIds: number[]): Promise<Zone[]> {
        return await this.repository.find(
            {where: zoneIds.map(zoneId => ({ id: zoneId }))}
        )
        }

    async partialUpdate(id: number, updateData: PartialUpdateZoneDto): Promise<Zone> {
    const zone = await this.repository.findOne({ where: { id } });

    if (!zone) {
        throw new NotFoundException(`Zone with id ${id} not found`);
    }

    Object.assign(zone, updateData);

    return this.repository.save(zone);
}

    async findZonesByDeliveryId(deliveryId: number, pagination: PaginationDto): Promise<Zone[]> {
        const offset = this.calculateOffset(pagination.page, pagination.quantity)
        return await this.repository.find({ where: { deliveries: {id: deliveryId}}, skip: offset, take: pagination.quantity})
    }

    calculateOffset(page: number, quantity: number): number{
        return (page-1)*quantity
    }
}