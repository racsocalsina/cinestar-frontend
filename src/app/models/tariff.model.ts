import { TariffType } from '@utils/enums';

export class Tariff {
    id!: number;
    is_promotion!: boolean;
    name!: string;
    online_price = 0;
    tariff_key!: string;
    ticket_promotion_id!: number;
    tickets_number!: number;
    type!: TariffType;
    quantity = 0;

    constructor( init: Partial<Tariff> ) {
        Object.assign( this, init );

        this.online_price = Number( init.online_price );
    }
}
