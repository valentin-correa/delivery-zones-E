import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Zone } from "./zones.entity"

@Entity('deliveries')
export class Delivery extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    person: number;

    @Column('json')
    location: {
        lat:number,
        lng:number
    };

    @Column()
    radius: number;

    @Column()
    status: string;
    
    @ManyToMany(() => Zone, zone => zone.deliveries)
    zones:Zone[];
} 