import { TariffType } from '@utils/enums';

interface Award {
    id: number;
    name: string;
    points: number;
    type: TariffType;
    quantity: number;
}

export interface TicketAwardInterface extends Award {
    code: string;
    tickets_number: number;
    online_price: number;
    movie_time_tariff_id: number;
}

export interface CodeAwardInterface extends TicketAwardInterface {
    code_promotion: string
}

export interface ChocoAwardInterface extends Award {
    image: string;
    price: number;
    favorite: boolean;
    sweet_type: string;
    promotion_id: number;
}
