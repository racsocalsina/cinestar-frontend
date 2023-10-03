import { MovementInterface } from '@interfaces/movement.interface';
import { PromotionInterface } from '@interfaces/promotion.interface';

export class User {
    birthdate!: string;
    cellphone!: string;
    document_number!: string;
    document_type!: string;
    email!: string;
    lastname!: string;
    name!: string;
    image!: string;
    ticket_promotional_data!: {
        total_points: number;
        movements: MovementInterface[];
        promotions: PromotionInterface[]
    };
    choco_promotional_data!: {
        total_points: number;
        movements: MovementInterface[];
        promotions: PromotionInterface[]
    };
    fullName!: string;

    constructor( init: Partial<User> ) {
        Object.assign( this, init );

        this.fullName = `${this.name} ${this.lastname}`;
    }

    department_id?: string;
    department?: any;
}
