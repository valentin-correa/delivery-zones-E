import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Zone } from "./zones.entity"

@Entity('deliveries')
export class Delivery extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    personId: number;

    @Column('jsonb')
    location: {
        lat:number,
        lng:number
    };

    @Column()
    radius: number;

    @Column({ type: "text", nullable: true })
    status: string | null;
    
    @ManyToMany(() => Zone, zone => zone.deliveries)
    zones:Zone[];
} 