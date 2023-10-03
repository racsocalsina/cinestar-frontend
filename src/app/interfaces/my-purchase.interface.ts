import { Cinema } from '@models/cinema.model';
import { FormatInterface, GenreInterface } from '@interfaces/format.interface';
import { Candy } from '@models/candy.model';

export interface MyPurchaseInterface {
    id: number;
    download_url: string;
    headquarter: Cinema;
    payment_data: PaymentData;
    status: string;
    sweet_data: SweetData;
    ticket_data: TicketData;
    tab_type: string;
}

interface TicketData {
    movie: Movie;
    qr_url: string;
    seats: string;
    room: string;
    start_at: Date;
    start_at_name: string;
    ticket_numbers: number;
    ticket_types: TicketType[];
}

interface SweetData {
    date: string;
    date_name: string;
    qr_url: string;
    items: Candy[];
}

interface Movie {
    name: string;
    genre: GenreInterface;
    format: FormatInterface;
    version: FormatInterface;
}

interface PaymentData {
    card: string;
    currency: string;
    datetime: string;
    full_name: string;
    total: string;
    type: string;
}

interface TicketType {
    quantity: number;
    name: string;
}
