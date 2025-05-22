import { BaseEntity, Column, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Zone } from "./zones.entity"
import { Exclude } from "class-transformer";

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

    @Column({ type: "text", nullable: true, default: 'available' })
    status: string | null;
    
    @ManyToMany(() => Zone, zone => zone.deliveries)
    zones:Zone[];

    @Exclude()
    @DeleteDateColumn()
    deletedAt: Date;
} 