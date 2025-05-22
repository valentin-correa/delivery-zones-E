import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindByProximityDto, FindByZoneDTO, UpdateDeliveryStatusDto, UpdateLocationDto } from './dto/delivery.dto';
import { ZoneService } from 'src/zone/zone.service';
import { ZoneDto } from 'src/zone/dto/zone.dto';
import { Delivery } from '../entities/deliveries.entity';
import { Zone } from '../entities/zones.entity';
import { CreateDeliveryDto, AssignZoneDto } from './dto/delivery.dto';
import { PaginationDto } from 'src/common/dto/common.dto';
import { skip } from 'node:test';

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

        const sortedDeliveries= deliveries.sort((a, b) => {
            return this.haversine(a.location.lat, a.location.lng, lat, lng) - this.haversine(b.location.lat, b.location.lng, lat, lng); 
             // Si distancia A es menor, 'a' estará antes que 'b'
        });
        if (proximityInfo.page !== null) {
            return this.manualPagination(sortedDeliveries,proximityInfo.page,proximityInfo.quantity)
        }

        return sortedDeliveries;
    }
    async updateLocation(id:number,newLocation:UpdateLocationDto): Promise<Delivery>{
        const delivery=await this.deliveryRepository.findOne({ where: { id } });
        if (!delivery) {
            throw new NotFoundException(`Delivery with id ${id} not found`);
        }

        delivery.location=newLocation.location;
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

    async findByZone(zoneId:FindByZoneDTO):Promise<Delivery[]>{
        const deliveries = await this.deliveryRepository.find({relations: ['zones'],});//.find({relations: ['zones'],}) trae la relacion zones
        const deliveriesWithThatZone = deliveries.filter(d=> d.zones.some(z=>z.id===zoneId.zoneId));
        if (zoneId.page !== null) {
            return this.manualPagination(deliveriesWithThatZone, zoneId.page, zoneId.quantity) 
        }
        return deliveriesWithThatZone;
    }

    async assignZone(id: number, assignZoneDto: AssignZoneDto): Promise<Delivery> {
        const delivery = await this.deliveryRepository.findOne({where: {id} })

        if (!delivery) { throw new NotFoundException(`Delivery with id ${id} not found`)}

        const zones = await this.zoneService.findZonesById(assignZoneDto.zoneIds);

        if (zones.length !== assignZoneDto.zoneIds.length) { throw new NotFoundException(`One or more zones with provided IDs do not exist`)}

        delivery.zones = zones;
        await this.deliveryRepository.save(delivery);
        
        return delivery;
      }

    async createDelivery(newDelivery:CreateDeliveryDto) : Promise<Delivery> {
        const delivery=this.deliveryRepository.create(newDelivery);
        await this.deliveryRepository.save(delivery);
        return delivery
    }

    async updateStatus(id: number, updateStatus: UpdateDeliveryStatusDto): Promise<Delivery> {

        const delivery = await this.deliveryRepository.findOne({ where: {id} })

        if (!delivery) { throw new NotFoundException(`Delivery with id ${id} not found`)}

        delivery.status = updateStatus.status;
        console.log(updateStatus)

        await this.deliveryRepository.save(delivery)
        
        return delivery
    }

    async deleteDelivery(id: number) {
        const delivery = await this.deliveryRepository.findOne({ where: { id } });
    
        if (!delivery) {
            throw new NotFoundException(`Delivery with id ${id} not found`);
        }
    
        await this.deliveryRepository.softRemove(delivery);
    
        return { message: "Delivery deleted" };
    }
    async removeZoneFromDelivery(deliveryId: number, zoneId: number) {
        const delivery = await this.deliveryRepository.findOne({
            where: { id: deliveryId },
            relations: ['zones'],
        });
        
        if (!delivery) throw new NotFoundException(`Delivery with id ${deliveryId} not found`);
        
        if (!delivery.zones.some(zone => zone.id === zoneId)) throw new Error(`Delivery ${deliveryId} is not associated with zone ${zoneId}`);
        
        delivery.zones = delivery.zones.filter(zone => zone.id !== zoneId);
        
        await this.deliveryRepository.save(delivery);
        
        return { message: "Zone removed from delivery" };
    }
    async findZonesByDeliveryId(id: number, pagination: PaginationDto): Promise<Zone[]> {
        const delivery = await this.deliveryRepository.exists({ where : {id}})
        if (!delivery) {
            throw new NotFoundException(`Delivery with id ${id} not found`);
        }
        
        return this.zoneService.findZonesByDeliveryId(id, pagination);

    }
    manualPagination<T>( query: T[],page:number,quantity:number): T[] {
        const offset=(page-1)*quantity;
        return query.slice(offset,offset+quantity)
    }
}
