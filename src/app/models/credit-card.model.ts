import { Utils } from '@utils/utils';
import { CreditCards } from '@utils/enums';

export class CreditCard {
    masked_number!: string;
    full_name!: string;
    token!: string;
    payment_method!: CreditCards;
    icon!: string | null;
    delete!: boolean;

    constructor( init: Partial<CreditCard> ) {
        Object.assign( this, init );

        this.icon = Utils.getCreditCardIcon( this.payment_method );
    }

}
