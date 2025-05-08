import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from '../entities/deliveries.entity';
import { Repository } from 'typeorm';
import { FindByProximityDto } from './dto/updateLocation.dto';
import { ZoneService } from 'src/zone/zone.service';

@Injectable()
export class DeliveryService {
    constructor(@InjectRepository(Delivery) private deliveryRepository: Repository<Delivery>,
                private readonly zoneService: ZoneService
            ) {}
    async find():Promise<Delivery[]> {
    return await this.deliveryRepository.find();
    }
    async findByProximity(proximityInfo: FindByProximityDto):Promise<Delivery[]>{
        const deliveries=await this.deliveryRepository.find()
        const { lat, lng, radius } = proximityInfo

        return deliveries.sort((a, b) => {
            return this.haversine(a.location.lat, a.location.lng, lat, lng) - this.haversine(b.location.lat, b.location.lng, lat, lng); 
             // Si distancia A es menor, 'a' estará antes que 'b'
        });
        //considerar mejorar la eficiencia llamando a haversine menos veces.
    }
    async updateLocation(id:number,newLocation:{lat:number,lng:number}): Promise<Delivery>{
        const delivery=await this.deliveryRepository.findOne({ where: { id } });
        if (!delivery) {
            throw new NotFoundException(`Delivery with id ${id} not found`);
        }
        delivery.location=newLocation;
        await this.deliveryRepository.save(delivery);
        return delivery
    }

    //método para calcular la distancia
    haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
        const R = 6371; // Radio de la Tierra en kilómetros
        const toRad = (x: number) => x * Math.PI / 180;  // Convierte grados a radianes
        
        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);
        
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Resultado en kilómetros
        
        return distance;
      }

    async findByZone(id:number):Promise<Delivery[]>{
        const deliveries = await this.deliveryRepository.find({relations: ['zones'],});//.find({relations: ['zones'],}) trae la relacion zones
        return deliveries.filter(d=> d.zones.some(z=>z.id===id))
    }

    async assignZone(id: number, zoneIds: number[]): Promise<Delivery> {
        const delivery = await this.deliveryRepository.findOne({where: {id} })

        if (!delivery) { throw new NotFoundException(`Delivery with id ${id} not found`)}

        const zones = await this.zoneService.findZonesById(zoneIds);

        if (zones.length !== zoneIds.length) { throw new NotFoundException(`One or more zones with provided IDs do not exist`)}

        delivery.zones = zones;
        await this.deliveryRepository.save(delivery);
        
        return delivery;
      }

    async createDelivery(newDelivery:{personId:number,location:{lat:number,lng:number},radius:number}) : Promise<Delivery> {
        const delivery=this.deliveryRepository.create(newDelivery);
        await this.deliveryRepository.save(delivery);
        return delivery
    }
      
}
