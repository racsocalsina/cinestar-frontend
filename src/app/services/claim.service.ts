import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ClaimParametersInterface } from '@interfaces/claim-parameters.interface';
import { BehaviorSubject } from 'rxjs';
import { StorageUtils } from '@utils/storage.utils';

@Injectable( {
    providedIn: 'root'
} )
export class ClaimService extends StorageUtils {

    private url = `${environment.api}/claims`;

    private _claimParameters: ClaimParametersInterface = {
        identification_types: [],
        older_list: [],
        types: []
    };
    private _claimParametersSubject = new BehaviorSubject<ClaimParametersInterface>( this._claimParameters );

    constructor( private http: HttpClient ) {
        super();
    }

    downloadClaim( id: number ) {
        const url = `${this.url}/${id}/download`;

        return this.http.get( url, { responseType: 'arraybuffer' } ).toPromise();
    }

    save( params: any ) {
        return this.http.post( this.url, params ).toPromise();
    }

    private fetchClaimParameters() {
        if ( this.getLocalStorage( 'claim_parameters' ) ) {
            this._claimParameters = JSON.parse( this.getLocalStorage( 'claim_parameters' ) );
            this._claimParametersSubject.next( this._claimParameters );
        }

        const url = `${this.url}/parameters`;

        this.http.get( url ).subscribe( ( res: any ) => {
            console.log( res );
            const { types, identification_types, older_list } = res;

            this._claimParameters = {
                types, identification_types, older_list
            };
            this.setLocalStorage( 'claim_parameters', JSON.stringify( this._claimParameters ) );
            this._claimParametersSubject.next( this._claimParameters );

        } );

    }

    getClaimParameters() {
        if ( !this._claimParameters.types.length || !this._claimParameters.older_list.length || !this._claimParameters.identification_types.length ) {
            this.fetchClaimParameters();
        }

        return this._claimParametersSubject.asObservable();
    }
}
