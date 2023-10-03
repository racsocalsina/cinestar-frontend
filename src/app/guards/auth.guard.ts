import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageUtils } from '@utils/storage.utils';

@Injectable( {
    providedIn: 'root'
} )
export class AuthGuard extends StorageUtils implements CanActivate {

    constructor( private router: Router ) {
        super();
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot ) {

        if ( this.getLocalStorage( 'user' ) && this.getLocalStorage( 'token' ) ) {
            return true;
        } else {
            this.router.navigateByUrl( '/login' ).finally();
            return false;
        }
    }

}
