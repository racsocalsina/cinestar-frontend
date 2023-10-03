import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScreenService } from '@services/screen.service';
import { UserService } from '@services/user.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthModalsService } from '@services/auth-modals.service';

@Component( {
    selector: 'app-index-chocolateria',
    templateUrl: './index-chocolateria.component.html',
    styleUrls: ['./index-chocolateria.component.scss']
} )
export class IndexChocolateriaComponent implements OnInit, OnDestroy {

    isLoggedIn: boolean = false;
    subs: Subscription[] = [];

    constructor( public screenService: ScreenService,
                 private authModalsService: AuthModalsService,
                 private userService: UserService ) { }

    ngOnInit(): void {

        this.subs.push( this.userService.isLoggedIn.subscribe( res => this.isLoggedIn = res ) );
        //
        // if ( !this.isLoggedIn ) {
        //     this.loginModal();
        // }
    }

    ngOnDestroy(): void {
        this.subs.forEach( s => s.unsubscribe() );
    }

    loginModal() {
        this.authModalsService.showLoginModal();
        this.authModalsService.onLogin.asObservable().pipe( take( 1 ) ).subscribe( () => {
            console.log( 'isLoggedIn' );
        } );
    }

}
