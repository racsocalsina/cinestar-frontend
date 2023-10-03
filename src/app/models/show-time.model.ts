export class ShowTime {
    id!: number;
    name!: string;
    address!: string;
    latitude!: string;
    longitude!: string;
    movie_formats!: MovieFormat[];
    movie_times: MovieTime[] = [];

    constructor( init: Partial<ShowTime> ) {
        Object.assign( this, init );

        // this.movie_formats.sort( ( a: MovieFormat, b: MovieFormat ) => ( a.name > b.name ) ? 1 : ( a.name < b.name ) ? -1 : 0 );

        /*if ( this.movie_formats.length ) {
         if ( this.movie_formats[ 0 ].movie_times.length ) {
         this.movie_times = this.movie_formats[ 0 ].movie_times;
         }
         }*/
    }
}

export interface MovieFormat {
    id: number;
    name: string;
    movie_times: MovieTime[];
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
