import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Zone } from '../entities/zones.entity';
import { Repository } from 'typeorm';
import { json } from 'stream/consumers';
import { CreateZoneDto } from './dto/createZone.dto';

@Injectable()
export class ZoneService {
  constructor(@InjectRepository(Zone) private repository: Repository<Zone>) { }
  
    async find():Promise<Zone[]> {
        return await this.repository.find();
    }
    async create(newZone:CreateZoneDto): Promise<Zone>{
        const zone=this.repository.create(newZone);
        await this.repository.save(zone);
        return zone
    }

    async updateZone(id: number, updateZone: {name: string, location: {lat: number, lng: number}, radius: number}): Promise<Zone> {
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
            await this.repository.softRemove(zone);
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
            {where: zoneIds.map(zoneId => ({ id: zoneId })) }
    )}

}
