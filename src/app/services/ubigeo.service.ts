import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageUtils } from '@utils/storage.utils';
import { BehaviorSubject } from 'rxjs';
import { DepartmentInterface } from '@interfaces/ubigeo';
import { environment } from '../../environments/environment';

@Injectable( {
    providedIn: 'root'
} )
export class UbigeoService extends StorageUtils {

    private _departmentsSubject = new BehaviorSubject<DepartmentInterface[]>( [] );
    private _departments: DepartmentInterface[] = [];

    constructor( private http: HttpClient ) {
        super();
    }

    private fetchUbigeo() {
        if ( this.getLocalStorage( 'ubigeo' ) ) {
            this._departments = JSON.parse( this.getLocalStorage( 'ubigeo' ) );
            this._departmentsSubject.next( this._departments );
        }

        const url = `${environment.api}/masters/ubigeo`;

        this.http.get( url ).subscribe( ( res: any ) => {
            this._departments = res.data;
            this._departmentsSubject.next( this._departments );
            this.setLocalStorage( 'ubigeo', JSON.stringify( this._departments ) );
        } );
    }

    getUbigeo() {
        if ( !this._departments.length ) {
            this.fetchUbigeo();
        }

        return this._departmentsSubject.asObservable();
    }
}
