import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Zone } from '../entities/zones.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ZoneService {
  constructor(@InjectRepository(Zone) private repository: Repository<Zone>) { }
  
  async find():Promise<Zone[]> {
    return await this.repository.find();
  }
}
