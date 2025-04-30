import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from '../entities/deliveries.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeliveryService {
    constructor(@InjectRepository(Delivery) private deliveryRepository: Repository<Delivery>) { }
    async find():Promise<Delivery[]> {
    return await this.deliveryRepository.find();
    }
    async findByProximity(requestLat:number,requestLng:number, radius:number):Promise<Delivery[]>{
        const deliveries=await this.deliveryRepository.find()
        return deliveries.sort((a, b) => {
            return this.haversine(a.location.lat, a.location.lng, requestLat, requestLng) - this.haversine(b.location.lat, b.location.lng, requestLat, requestLng); 
             // Si distancia A es menor, 'a' estará antes que 'b'
        });
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
        const deliveries = await this.deliveryRepository
            .createQueryBuilder('delivery')//Creamos una consulta SQL personalizada sobre la tabla deliveries, usando el alias 'delivery'.
            .leftJoinAndSelect('delivery.zones', 'zone')//Unimos con la tabla intermedia que conecta deliveries con zones (relación @ManyToMany), y además traemos toda la información de las zonas.
      //QUIERO VER SI ESTO ESTA BIEN
            .where('zone.id = :zoneId', { zoneId })//Filtramos: solo queremos deliveries relacionados con la zona cuyo id es igual al valor que recibimos.
            .getMany();//Ejecuta la consulta y devuelve todos los deliveries que cumplan la condición.

            //Formateo respuesta
            return deliveries.map(delivery => ({
                id: delivery.id,
                personId: delivery.person,
                location: delivery.location,
                radius: delivery.radius,
                status: delivery.status,
                zones: delivery.zones.map(zone => ({
                  id: zone.id,
                  name: zone.name,
                  location: zone.location,
                  radius: zone.radius,
                }))
              }));
    }
}
