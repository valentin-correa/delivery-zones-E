import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from '../entities/zones.entity';
import { ZoneDto } from './dto/Zone.dto';

@Injectable()
export class ZoneService {
  constructor(@InjectRepository(Zone) private repository: Repository<Zone>) { }
  
    async find():Promise<Zone[]> {
        return await this.repository.find();
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

    async removeDeliveryFromZone(zoneId: number, deliveryId: number) {
        const zone = await this.repository.findOne({
          where: { id: zoneId },
          relations: ['deliveries'],
        });
      
        if (!zone) throw new NotFoundException(`Zone with id ${zoneId} not found`);
      
        if (!zone.deliveries.some(delivery => delivery.id === deliveryId)) {
            throw new Error(`Delivery ${deliveryId} is not associated with zone ${zoneId}`);
          }

        zone.deliveries = zone.deliveries.filter(delivery => delivery.id !== deliveryId);
      
        await this.repository.save(zone);
      
        return { message: "Zone removed from delivery" };
      }

}
