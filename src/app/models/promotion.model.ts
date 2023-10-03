export class Promotion {
    id!: number;
    name!: string;
    description!: string;
    image!: string;
    type!: string;
    start_date!: string;
    end_date!: string;
    constructor( init: Partial<Promotion> ) {
        Object.assign( this, init );
    }
}
