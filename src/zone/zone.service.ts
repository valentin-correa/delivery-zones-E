import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from '../entities/zones.entity';
import { PartialUpdateZoneDto, ZoneDto } from './dto/Zone.dto';
import { PaginationDto } from 'src/common/dto/common.dto';
import { take } from 'rxjs';

@Injectable()
export class ZoneService {
    constructor(@InjectRepository(Zone) private repository: Repository<Zone>) { }

    async find(pagination: PaginationDto): Promise<Zone[]> {
        const options: any = {
            order: {
                id: 'ASC' // ordena ascendentemente
            }
        }

        if (pagination.page !== null) {
            const offset = this.calculateOffset(pagination.page, pagination.quantity);
            options.skip = offset;
            options.take = pagination.quantity;
        }

        return this.repository.find(options);
    }

    async create(newZone: ZoneDto): Promise<Zone> {
        const zone = this.repository.create(newZone);
        await this.repository.save(zone);
        return zone
    }

    async updateZone(id: number, updateZone: ZoneDto): Promise<Zone> {
        const zone = await this.repository.findOne({ where: { id } });

        if (!zone) {
            throw new NotFoundException(`Zone with id ${id} not found`);
        }

        Object.assign(zone, updateZone); // Este método se encarga de asignarle al objeto `zone`, definido al principio de la función, las propiedades del objeto `updateZone`

        await this.repository.save(zone);
        return zone;
    }

    async deleteZone(id: number) {
        const zone = await this.repository.findOne({ where: { id } });

        if (zone) {
            await this.repository.softRemove(zone);
        }
        else throw new NotFoundException(`Zone with id ${id} not found`);

        return { message: "Zone deleted" }
    }
    async findById(id: number): Promise<Zone> {
        const zone = await this.repository.findOne({ where: { id } });
        if (!zone) {
            throw new NotFoundException(`Zone with id ${id} not found`);
        }
        return zone;
    }


    async findZonesById(zoneIds: number[]): Promise<Zone[]> {
        return await this.repository.find(
            { where: zoneIds.map(zoneId => ({ id: zoneId })) } //Genera un array de condiciones y trae todas las entidades cuyo id está en el array"
        )
    }

    async partialUpdate(id: number, updateData: PartialUpdateZoneDto): Promise<Zone> {
        const zone = await this.repository.findOne({ where: { id } });

        if (!zone) {
            throw new NotFoundException(`Zone with id ${id} not found`);
        }

        Object.assign(zone, updateData);

        await this.repository.save(zone);

        return (await this.repository.findOne({ where: { id } }))!;
    }

    async findZonesByDeliveryId(deliveryId: number, pagination: PaginationDto): Promise<Zone[]> {

        const options: any = {
            where: { deliveries: { id: deliveryId } } //busca todas las zonas que tienen asociada un delivery con ese deliveryId.
        }

        if (pagination.page !== null) {
            const offset = this.calculateOffset(pagination.page, pagination.quantity)
            options.skip = offset;
            options.take = pagination.quantity;
        }
        return await this.repository.find(options)
    }

    calculateOffset(page: number, quantity: number): number {
        return (page - 1) * quantity
    }
}