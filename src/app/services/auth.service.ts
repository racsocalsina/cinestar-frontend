import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable( {
    providedIn: 'root'
} )
export class AuthService {

    private url = `${environment.api}/auth`;

    constructor( private http: HttpClient ) { }

    register( params: any ): Promise<any> {
        const url = `${this.url}/signup`;
        return this.http.post( url, params ).toPromise();
    }

    login( params: any ): Promise<any> {
        const url = `${this.url}/login`;
        return this.http.post( url, params ).toPromise();
    }

    logout(): Promise<any> {
        const url = `${this.url}/logout`;
        return this.http.post(url, {}).toPromise();
    }

    recoveryPasswordEmail( params: any ): Promise<any> {
        const url = `${this.url}/recovery/send-email`;
        return this.http.post( url, params ).toPromise();
    }

    recoveryPassword( params: any ): Promise<any> {
        const url = `${this.url}/recovery/change-password`;
        return this.http.post( url, params ).toPromise();
    }
}
