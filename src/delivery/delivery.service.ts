import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from './entities/deliveries.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeliveryService {
    constructor(@InjectRepository(Delivery) private repository: Repository<Delivery>) { }
    async find():Promise<Delivery[]> {
    return await this.repository.find();
    }
}
