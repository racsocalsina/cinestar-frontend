export class Candy {
    id!: number;
    name!: string;
    image!: string;
    price!: number;
    favorite!: boolean;
    type_id!: number;
    sweet_type!: string;
    type!: string;
    choco_promotion_id!: number;
    quantity = 0;

    constructor( init: Partial<Candy> ) {
        Object.assign( this, init );
    }
}
