import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FloatingMovieInterface } from '@interfaces/floating-movie.interface';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Movie } from '@models/movie.model';
import { map } from 'rxjs/operators';
import { StorageUtils } from '@utils/storage.utils';
import { ShowTime } from '@models/show-time.model';


@Injectable( {
    providedIn: 'root'
} )
export class MoviesService extends StorageUtils {

    private url = `${environment.api}/movies`;
    private url_v2 = `${environment.api_v2}/movies`;

    private _floatingMovie = new Subject<FloatingMovieInterface>();

    private _billboardSubject = new BehaviorSubject<Movie[]>( [] );
    private _billboard: Movie[] = [];
    private _nextReleases: Movie[] = [];

    private _showTimes: ShowTime[] = [];

    constructor( private http: HttpClient ) {
        super();
    }

    setFloatingMovie( values: FloatingMovieInterface ): void {
        this._floatingMovie.next( values );
    }

    fetchBillboard( params: any ) {
        if ( this.getLocalStorage( 'billboard' ) ) {
            this._billboard = JSON.parse( this.getLocalStorage( 'billboard' ) ).map( ( x: Movie ) => new Movie( x ) );
            this._billboardSubject.next( this._billboard );
        }

        params = {
            ...params,
            is_next_releases: false
        };

        this.http.get( this.url, { params } ).subscribe( async ( res: any ) => {
            this._billboard = res.data.map( ( x: Movie ) => new Movie( x ) );
            this.setLocalStorage( 'billboard', JSON.stringify( this._billboard ) );
            this._billboardSubject.next( this._billboard );
        } );
    }

    getBillboard( params: any = {} ) {
        if ( !this._billboard.length ) {
            this.fetchBillboard( params );
        }
        return this._billboardSubject.asObservable();
    }

    fetchShowTimes( params: any ): Promise<ShowTime[]> {
        const url = `${environment.api}/movies-times`;
        return new Promise<ShowTime[]>( ( resolve, reject ) => {
            this.http.get( url, { params } )
            .subscribe( ( res: any ) => {
                this._showTimes = res.data.map( ( x: any ) => new ShowTime( x ) );
                resolve( this._showTimes );
            }, error => reject( error ) );
        } );
    }

    getShowTimeById( id: number ) {
        return this._showTimes.find( x => x.id === id );
    }

    getFloatingMovie(): Observable<FloatingMovieInterface> {
        return this._floatingMovie.asObservable();
    }

    getMoviesByFilters( params: any ): Promise<Movie[]> {
        return this.getMovies( { ...params, is_next_releases: false } );
    }

    fetchNextReleases() {
        return this.getMovies( { is_next_releases: true } );
    }

    getMovies( params: any, version = 1 ) {
        let url = this.url;

        switch (version) {
            case 1:
                url = this.url;
                break;

            case 2:
                url = this.url_v2;
                break;

            default:
                break;
        }

        return new Promise<Movie[]>( async ( resolve, reject ) => {

            this.http.get( url, { params } ).subscribe( ( res: any ) => {
                const movies = res.data.map( ( x: any ) => new Movie( x ) );

                if ( params.is_next_releases ) {
                    this._nextReleases = movies;
                    this.setLocalStorage( 'next_releases', JSON.stringify( this._nextReleases ) );
                } else {
                    this._billboard = movies;
                    this.setLocalStorage( 'billboard', JSON.stringify( this._billboard ) );
                }

                resolve( movies );
            }, () => reject );
        } );
    }

    getMovieById( id: number ): Promise<Movie> {
        return this.http.get( `${this.url}/${id}` )
        .pipe( map( ( res: any ) => new Movie( res.data ) ) ).toPromise();
    }


}
