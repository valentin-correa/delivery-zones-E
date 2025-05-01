import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Delivery } from "./deliveries.entity"

@Entity('zones')
export class Zone extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column('json')
    location: {'lat': number, 'lng': number};

    @Column()
    radius: number

    @ManyToMany(() => Delivery, delivery => delivery.zones)
    @JoinTable()
    deliveries: Delivery[];
}