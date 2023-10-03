import { CityInterface } from '@interfaces/city.interface';
import { FormatInterface } from '@interfaces/format.interface';
import { CinemaImageInterface } from '@interfaces/cinema-image.interface';

export class Cinema {
    id!: number;
    name!: string;
    description!: string;
    address!: string;
    main_photo!: string;
    latitude!: number;
    longitude!: number;
    point_sale!: string;
    api_url!: string;
    is_favorite!: boolean;
    city_id!: number;
    city!: CityInterface;
    movie_formats!: FormatInterface[];
    headquarter_images!: CinemaImageInterface[];

    constructor( init: Partial<Cinema> ) {
        Object.assign( this, init );

        this.latitude = Number( init.latitude );
        this.longitude = Number( init.longitude );
    }
}
