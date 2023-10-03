import { Injectable } from '@angular/core';
import { User } from '@models/user.model';
import { StorageUtils } from '@utils/storage.utils';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MyPurchaseInterface } from '@interfaces/my-purchase.interface';

@Injectable( {
    providedIn: 'root'
} )
export class UserService extends StorageUtils {

    private url = `${environment.api}/auth`;
    private _user!: User | null;
    private userSubject = new BehaviorSubject<User>( new User( {} ) );
    private _isLoggedIn = new BehaviorSubject<boolean>( false );

    private _myPurchasesSubject = new BehaviorSubject<MyPurchaseInterface[]>( [] );
    private _myPurchases: MyPurchaseInterface[] = [];

    constructor( private http: HttpClient ) {
        super();
        if ( this.getLocalStorage( 'user' ) ) {
            this.setUser( JSON.parse( this.getLocalStorage( 'user' ) ) );
        }
    }

    get isLoggedIn() {
        return this._isLoggedIn.asObservable();
    }

    setUser( user: User | null ) {
        if ( user ) {
            this._user = new User( user );
            this.setLocalStorage( 'user', JSON.stringify( this._user ) );
            this.userSubject.next( this._user );
            this._isLoggedIn.next( true );
        } else {
            this._isLoggedIn.next( false );
            this._user = null;
            this.userSubject.next( new User( {} ) );
            this.removeLocalStorage( 'user' );
        }

    }

    get User() {
        return this.userSubject.asObservable();
    }

    getProfile() {
        const url = `${this.url}/get-profile`;
        return this.http.get( url )
        .pipe( map( ( res: any ) => {
            const user = new User( res.data );
            this.setUser( user );
            return user;
        } ) ).toPromise();
    }

    updateProfile( params: any ) {
        const url = `${this.url}/edit-profile`;
        return this.http.post( url, params ).toPromise();
    }

    fetchMyPurchases() {
        if ( this.getLocalStorage( 'my_purchases' ) ) {
            this._myPurchases = JSON.parse( this.getLocalStorage( 'my_purchases' ) );
            this._myPurchasesSubject.next( this._myPurchases );
        }

        const url = `${environment.api}/purchases`;
        this.http.get( url ).subscribe( ( res: any ) => {
            this._myPurchases = res.data;
            this.setLocalStorage( 'my_purchases', JSON.stringify( this._myPurchases ) );
            this._myPurchasesSubject.next( this._myPurchases );
        } );
    }

    getMyPurchases() {
        // this.fetchMyPurchases();
        return this._myPurchasesSubject.asObservable();
    }

    clearMyPurchases() {
        this._myPurchases = [];
        this._myPurchasesSubject.next( [] );
    }

}

