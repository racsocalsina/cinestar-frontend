import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '@services/user.service';
import { Observable } from 'rxjs';
import { StorageUtils } from '@utils/storage.utils';
import { CinemaService } from '@services/cinema.service';
import { Router } from '@angular/router';
import { BuyTicketService } from '@services/buy-ticket.service';
import {take} from "rxjs/operators";
import {AuthModalsService} from "@services/auth-modals.service";
import {AuthService} from "@services/auth.service";

@Component( {
    selector: 'app-responsive-menu',
    templateUrl: './responsive-menu.component.html',
    styleUrls: ['./responsive-menu.component.scss']
} )
export class ResponsiveMenuComponent extends StorageUtils implements OnInit {

    // @Output() onRegister = new EventEmitter();
    // @Output() onLogin = new EventEmitter();

    items = [
        { id: 'home', title: 'HOME', route: '/' },
        { id: 'movies', title: 'PELÍCULAS', route: '/peliculas' },
        { id: 'cinema', title: 'CINES', route: '/cines' },
        { id: 'chocolateria', title: 'CHOCOLATERÍA', route: '/chocolateria' },
        { id: 'partner', title: 'SOCIO', route: '/socios' },
        { id: 'corporate', title: 'CORPORATIVO', route: '/corporativo' },
        { id: 'promotions', title: 'PROMOCIONES', route: '/promotions' },
    ];

    $isLoggedIn!: Observable<boolean>;

    constructor( private userService: UserService,
                 private buyTicket: BuyTicketService,
                 private router: Router,
                 private cinemaService: CinemaService,
                 private authModalsService: AuthModalsService,
                 private authService: AuthService) {
        super();
    }

    ngOnInit(): void {
        this.$isLoggedIn = this.userService.isLoggedIn;
    }

    toggleMenu( value: string ): void {
        const responsiveMenu = document.getElementById( 'responsive-menu' );
        if ( responsiveMenu ) {
            responsiveMenu.style.left = value;
        }
    }

    register() {
        this.toggleMenu( '-100%' );
        this.onClickRegister();
    }

    login() {
        this.toggleMenu( '-100%' );
        this.onClickLogin();
    }

    logOut() {
        if ( this.buyTicket.purchase ) {
            this.buyTicket.cancelPurchase( this.buyTicket.purchase.id )
            .then(() => {
                this.logout();
                this.clearData();
            } )
            .catch( console.log );
        } else {
            this.logout();
            this.clearData();
        }
    }

    async logout() {
        const login = await this.authService.logout();
        console.log("LOGOUT", login);
    }

    clearData() {
        this.userService.setUser( null );
        this.clearLocalStorage();
        this.cinemaService.clearFavorites();
        this.userService.clearMyPurchases();
        this.router.navigateByUrl( '/' );
    }

    onClickLogin( message?: boolean ): void {
        this.authModalsService.showLoginModal( message );
        this.authModalsService.onLogin.asObservable().pipe( take( 1 ) ).subscribe( () => {
            this.cinemaService.fetchCinemas();
        } );
    }

    onClickRegister(): void {
        this.authModalsService.showRegisterModal();
    }
}
