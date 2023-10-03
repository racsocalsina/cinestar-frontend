export class Partner {
    image!: string;
    terms!: string;
    title!: string;
    benefits!: [];
    sub_title!: string;
    description!: string;
    ticket_awards!: any[];
    choco_awards!: any[];

    constructor( init: Partial<Partner> ) {
        Object.assign( this, init );
    }
}

