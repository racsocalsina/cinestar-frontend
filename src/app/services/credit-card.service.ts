import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {BehaviorSubject, Subject} from 'rxjs';
import { CreditCard } from '@models/credit-card.model';
import { StorageUtils } from '@utils/storage.utils';
import { map } from 'rxjs/operators';

@Injectable( {
    providedIn: 'root'
} )
export class CreditCardService extends StorageUtils {

    private _creditCardSubject = new BehaviorSubject<CreditCard[]>( [] );
    public _creditCardDeleteSubject = new BehaviorSubject<string>("");
    creditCards: CreditCard[] = [];
    private url = `${environment.api}/cards`;
    private url_v2 = `${environment.api_v2}/cards`;


    constructor( private http: HttpClient ) {
        super();
    }

    addCreditCard( params: any ) {
        return this.http.post( this.url_v2, params ).pipe( map( ( res: any ) => new CreditCard( res.data ) ) ).toPromise();
    }

    deleteCreditCard( token: string ) {
        return this.http.delete( `${this.url}/${token}` ).toPromise();
    }

    emitCardDelete(token: string) {
        this._creditCardDeleteSubject.next(token);
    }

    private fetchCreditCards() {
        if ( this.getLocalStorage( 'credit-cards' ) ) {
            this.creditCards = JSON.parse( this.getLocalStorage( 'credit-cards' ) ).map( ( x: CreditCard ) => new CreditCard( x ) );
            this._creditCardSubject.next( this.creditCards );
        }

        this.http.get( this.url ).subscribe( ( res: any ) => {
            this.creditCards = res.data.map( ( x: CreditCard ) => new CreditCard( x ) );
            this.setLocalStorage( 'credit-cards', JSON.stringify( this.creditCards ) );
            this._creditCardSubject.next( this.creditCards );
        } );
    }

    getCreditCards() {
        this.fetchCreditCards();

        return this._creditCardSubject.asObservable();
    }
}
