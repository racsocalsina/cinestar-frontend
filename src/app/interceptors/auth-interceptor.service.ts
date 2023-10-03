import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageUtils } from '@utils/storage.utils';
import { UserService } from '@services/user.service';

@Injectable( {
    providedIn: 'root'
} )
export class AuthInterceptorService extends StorageUtils implements HttpInterceptor {

    constructor( private userService: UserService ) {
        super();
    }

    intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
        // let request = req;

        let request = req.clone( {
            setHeaders: {
                'Trade-Name': 'CINESTAR' // MOVIETIME
            }
        } );

        if ( this.getLocalStorage( 'token' ) ) {
            request = request.clone( {
                setHeaders: {
                    Authorization: `Bearer ${this.getLocalStorage( 'token' )}`
                }
            } );
        }

        return next.handle( request ).pipe(
            catchError( ( err: HttpErrorResponse ) => {
                console.log( 'InterceptorService:', err );
                const error = err?.error?.data?.error?.message || err.error?.error?.error || err.error?.error || err.error?.message || err.message || err;

                if ( err.status === 401 ) {
                    this.userService.setUser( null );
                    this.clearLocalStorage();
                }

                return throwError( error );
            } )
        );
    }
}
