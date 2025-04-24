import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
"import { Zones }"

@Entity('deliveries')
export class Deliveries extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    person: number;

    @Column()
    location: {
        lat:number,
        ing:number
    };

    @Column()
    radius: number;

    @Column()
    status: string;

    @Column()
    zones:Zones[];
    
    @ManyToMany(() => Zone, zone => zone.deliveries)
    zones:Zone[];
} 