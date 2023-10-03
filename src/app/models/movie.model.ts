import { Utils } from '@utils/utils';
import { FormatInterface } from '@interfaces/format.interface';

export class Movie {
    id!: number;
    code!: string;
    name!: string;
    image!: string;
    url_trailer!: string;
    summary!: string;
    duration_in_minutes!: number;
    type_of_censorship!: string;
    gender_id!: number;
    gender_name!: string;
    country_id!: number;
    country_name!: string;
    premier_date!: string;
    is_release!: boolean;
    formats!: string;
    movie_formats?: FormatInterface[];
    movie_times: MovieTime[] = [];

    constructor( init: Partial<Movie> ) {
        Object.assign( this, init );

        this.is_release = this.premier_date > Utils.getStringDate( { format: 'YYYY-MM-DD' } );

        if ( this.movie_formats ) {
            this.formats = Utils.arrToString( { arr: this.movie_formats || [], field: 'short' } );
        }


    }
}

export interface MovieTime {
    id: number;
    room_id: number;
    movie_id: number;
    headquarter_id: number;
    movie_format_id: number;
    movie_version_id: number;
    movie_version_name: string;
    remote_funkey: string;
    fun_nro: string;
    date_start: Date;
    time_start: string;
}
