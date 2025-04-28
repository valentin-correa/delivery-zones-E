import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from '../entities/deliveries.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeliveryService {
    constructor(@InjectRepository(Delivery) private repository: Repository<Delivery>) { }
    async find():Promise<Delivery[]> {
    return await this.repository.find();
    }
    async updateLocation(id:number,newLocation:{lat:number,lng:number}): Promise<Delivery>{
        const delivery=await this.repository.findOne({ where: { id } });
        if (!delivery) {
            throw new NotFoundException(`Delivery with id ${id} not found`);
        }
        delivery.location=newLocation;
        await this.repository.save(delivery);
        return delivery
    }
}
