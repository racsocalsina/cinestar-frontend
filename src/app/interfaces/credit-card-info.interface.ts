import { CreditCards } from '@utils/enums';

export interface CreditCardInfoInterface {
    type: CreditCards;
    length: number;
    mask: string;
    code: {
        name: string;
        length: number;
    };
}
