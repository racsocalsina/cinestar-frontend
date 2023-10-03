import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cinema } from '@models/cinema.model';
import { environment } from '../../environments/environment';
import { StorageUtils } from '@utils/storage.utils';
import { map } from 'rxjs/operators';

@Injectable( {
    providedIn: 'root'
} )
export class CinemaService extends StorageUtils {

    private _cinemasSubject = new BehaviorSubject<Cinema[]>( [] );
    private _cinemas: Cinema[] = [];
    public _cinemaSelected: Cinema | undefined;
    public _billboardDates: any;

    constructor( private http: HttpClient ) {
        super();
    }

    fetchCinemas( getLocaStorage = true ) {
        if ( getLocaStorage && this.getLocalStorage( 'cinemas' ) ) {
            this._cinemas = JSON.parse( this.getLocalStorage( 'cinemas' ) ).map( ( x: Cinema ) => new Cinema( x ) );
            this._cinemasSubject.next( this._cinemas );
        }

        let url = `${environment.api}/headquarters`;
        if ( this.getLocalStorage( 'token' ) ) {
            url = `${environment.api}/users/headquarters`;
        }

        this.http.get( url ).subscribe( ( res: any ) => {
            this._cinemas = res.data.map( ( x: Cinema ) => new Cinema( x ) );
            this._cinemas.sort( ( a: Cinema, b: Cinema ) => ( a.is_favorite === b.is_favorite ) ? 0 : a.is_favorite ? -1 : 1 );
            // console.log( this._cinemas );
            this._cinemasSubject.next( this._cinemas );
            this.setLocalStorage( 'cinemas', JSON.stringify( this._cinemas ) );
        } );

    }

    getCinemas(): Observable<Cinema[]> {
        if ( !this._cinemas.length ) {
            this.fetchCinemas();
        }
        return this._cinemasSubject.asObservable();
    }

    fetchCinemaById( id: number ): Promise<Cinema> {
        const url = `${environment.api}/headquarters/${id}`;
        return this.http.get( url )
        .pipe( map( ( res: any ) => new Cinema( res.data ) ) ).toPromise();
    }

    getCinemaById( id: number | string ): Cinema | undefined {
        return this._cinemas.find( c => Number( c.id ) === Number( id ) );
    }

    toggleFavorite( cinemaId: number ) {
        const url = `${environment.api}/headquarters/${cinemaId}/favorite`;
        return this.http.post( url, {} ).toPromise();
    }

    clearFavorites() {
        this._cinemas.map( cinema => cinema.is_favorite = false );
        this._cinemasSubject.next( this._cinemas );
    }
}
