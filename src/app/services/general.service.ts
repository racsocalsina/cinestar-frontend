import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StorageUtils } from '@utils/storage.utils';
import { BehaviorSubject } from 'rxjs';
import { FormatInterface, GenreInterface } from '@interfaces/format.interface';
import { environment } from '../../environments/environment';
import { DocumentTypeInterface } from '@interfaces/document-type.interface';
import { CityInterface } from '@interfaces/city.interface';
import { BillboardDatesInterface } from '@interfaces/billboard-dates.interface';
import { BillboardDatesInterfaceForCinema } from '@interfaces/billboard-dates.interfaceForCinema';

@Injectable( {
    providedIn: 'root'
} )
export class GeneralService extends StorageUtils {

    private _formatSubject = new BehaviorSubject<FormatInterface[]>( [] );
    private _formats: FormatInterface[] = [];

    private _genresSubject = new BehaviorSubject<GenreInterface[]>( [] );
    private _genres: GenreInterface[] = [];

    private _billboardDatesSubject = new BehaviorSubject<BillboardDatesInterface[]>( [] );
    private _billboardDatesSubjectForCinema = new BehaviorSubject<BillboardDatesInterfaceForCinema[]>( [] );
    private _billboardDates: BillboardDatesInterface[] = [];
    private _billboardDatesForCinema: BillboardDatesInterfaceForCinema[] = [];

    private _nextReleasesDatesSubject = new BehaviorSubject<BillboardDatesInterface[]>( [] );
    private _nextReleasesDates: BillboardDatesInterface[] = [];

    private _citiesSubject = new BehaviorSubject<CityInterface[]>( [] );
    private _cities: CityInterface[] = [];

    private _documentTypesSubject = new BehaviorSubject<DocumentTypeInterface[]>( [] );
    private _documentTypes: DocumentTypeInterface[] = [];

    constructor( private http: HttpClient ) {
        super();
    }

    private fetchBillboardDates() {
        if ( this.getLocalStorage( 'billboard_dates' ) ) {
            //this._billboardDates = JSON.parse( this.getLocalStorage( 'billboard_dates' ) );
            //this._billboardDatesSubject.next( this._billboardDates );
        }

        const url = `${environment.api}/masters/billboard_dates`;
        this.http.get( url ).subscribe( ( res: any ) => {
            //this._billboardDates = res.data;
            //this.setLocalStorage( 'billboard_dates', JSON.stringify( res.data ) );
            this._billboardDatesSubject.next( res.data );
        } );
     }

      private fetchBillboardDatesForCinema(params: any) {
        if (this.getLocalStorage('billboard_dates')) {
        //   this._billboardDates = JSON.parse(this.getLocalStorage('billboard_dates'));
        //   this._billboardDatesSubject.next(this._billboardDates);
        }

        const url = `${environment.api_v2}/movies-times/dates`;
        const queryParams = new HttpParams().set('headquarter_id', params.headquarter_id);

        this.http.get(url, { params: queryParams }).subscribe((res: any) => {
        //   this._billboardDates = res.data;
        //   this.setLocalStorage('billboard_dates', JSON.stringify(res.data));
          this._billboardDatesSubjectForCinema.next(res.data);
        });
      }

      getBillboardDates() {
        if (!this._billboardDates.length) {
          this.fetchBillboardDates();
        }
        return this._billboardDatesSubject.asObservable();
      }

      getBillboardDatesForCinema(params: any) {
        if (!this._billboardDatesForCinema.length) {
          this.fetchBillboardDatesForCinema(params);
        }
        return this._billboardDatesSubjectForCinema.asObservable();
      }

    private fetchNextReleasesDates( params: any ) {
        if ( this.getLocalStorage( 'next_releases_dates' ) ) {
            this._nextReleasesDates = JSON.parse( this.getLocalStorage( 'next_releases_dates' ) );
            this._nextReleasesDatesSubject.next( this._nextReleasesDates );
        }

        const url = `${environment.api}/masters/billboard_dates/next_releases`;
        this.http.get( url, { params } ).subscribe( ( res: any ) => {
            res.data.sort( ( a: BillboardDatesInterface, b: BillboardDatesInterface ) => ( a.date > b.date ) ? 1 : ( a.date < b.date ) ? -1 : 0 );
            this._nextReleasesDates = res.data;
            this.setLocalStorage( 'next_releases_dates', JSON.stringify( res.data ) );
            this._nextReleasesDatesSubject.next( res.data );
        } );
    }

    getNextReleasesDates( params?: any ) {
        this.fetchNextReleasesDates( params );
        return this._nextReleasesDatesSubject.asObservable();
    }

    fetchFormats() {
        if ( this.getLocalStorage( 'formats' ) ) {
            this._formats = JSON.parse( this.getLocalStorage( 'formats' ) );
            this._formatSubject.next( this._formats );
        }

        const url = `${environment.api}/movie-formats`;
        this.http.get( url ).subscribe( ( res: any ) => {
            this._formats = res.data;
            this.setLocalStorage( 'formats', JSON.stringify( res.data ) );
            this._formatSubject.next( res.data );
        } );
    }

    getFormats() {
        if ( !this._formats.length ) {
            this.fetchFormats();
        }
        return this._formatSubject.asObservable();
    }

    getFormatById( id: number ) {
        return this._formats.find( x => x.id === id );
    }

    private fetchGenres() {
        if ( this.getLocalStorage( 'genres' ) ) {
            this._genres = JSON.parse( this.getLocalStorage( 'genres' ) );
            this._genresSubject.next( this._genres );
        }

        const url = `${environment.api}/masters/movie_genres`;
        this.http.get( url ).subscribe( ( res: any ) => {
            this._genres = res.data;
            this.setLocalStorage( 'genres', JSON.stringify( res.data ) );
            this._genresSubject.next( res.data );
        } );
    }

    getGenres() {
        if ( !this._genres.length ) {
            this.fetchGenres();
        }
        return this._genresSubject.asObservable();
    }

    private fetchCities() {
        if ( this.getLocalStorage( 'cities' ) ) {
            this._cities = JSON.parse( this.getLocalStorage( 'cities' ) );
            this._citiesSubject.next( this._cities );
        }

        const url = `${environment.api}/cities`;
        this.http.get( url ).subscribe( ( res: any ) => {
            this._cities = res.data;
            this.setLocalStorage( 'cities', JSON.stringify( res.data ) );
            this._citiesSubject.next( res.data );
        } );
    }

    getCities() {
        if ( !this._cities.length ) {
            this.fetchCities();
        }
        return this._citiesSubject.asObservable();
    }


    private fetchDocumentTypes() {

        if ( this.getLocalStorage( 'document_types' ) ) {
            this._documentTypes = JSON.parse( this.getLocalStorage( 'document_types' ) );
            this._documentTypesSubject.next( this._documentTypes );
        }

        const url = `${environment.api}/masters/type_documents`;
        this.http.get( url ).subscribe( ( res: any ) => {
            const { data: document_types } = res;

            this.setLocalStorage( 'document_types', JSON.stringify( document_types ) );
            this._documentTypesSubject.next( document_types );
            this._documentTypes = document_types;
        } );
    }

    getDocumentTypes() {
        if ( !this._documentTypes.length ) {
            this.fetchDocumentTypes();
        }

        return this._documentTypesSubject.asObservable();
    }

}
