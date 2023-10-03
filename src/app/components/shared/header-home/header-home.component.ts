import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
import { ContactService } from '@services/contact.service';
import { NotificationInterface } from '@interfaces/notification.interface';
import { take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageUtils } from '@utils/storage.utils';
import { UserService } from '@services/user.service';
import { User } from '@models/user.model';
import { AuthModalsService } from '@services/auth-modals.service';
import { CinemaService } from '@services/cinema.service';
import { ModalPaymentDeniedComponent } from '@modals/modal-payment-denied/modal-payment-denied.component';
import { BuyTicketService } from '@services/buy-ticket.service';
import {AuthService} from "@services/auth.service";
import {environment} from "../../../../environments/environment";

@Component( {
    selector: 'app-header-home',
    templateUrl: './header-home.component.html',
    styleUrls: ['./header-home.component.scss']
} )
export class HeaderHomeComponent extends StorageUtils implements OnInit, OnDestroy {

    items = [
        { id: 'home', title: 'HOME', route: '/' },
        { id: 'movies', title: 'PELÍCULAS', route: '/peliculas' },
        { id: 'cinema', title: 'CINES', route: '/cines' },
        { id: 'chocolateria', title: 'CHOCOLATERÍA', route: '/chocolateria' },
        { id: 'partner', title: 'SOCIO', route: '/socios' },
        { id: 'corporate', title: 'CORPORATIVO', route: '/corporativo' },
        { id: 'promotions', title: 'PROMOCIONES', route: '/promotions' },
    ];

    $showNotification!: Observable<NotificationInterface>;
    user!: User;
    isLoggedIn = false;
    subs: Subscription[] = [];
    environment = environment;
    constructor( private modalService: BsModalService,
                 private router: Router,
                 private route: ActivatedRoute,
                 private userService: UserService,
                 private buyTicket: BuyTicketService,
                 private authModalsService: AuthModalsService,
                 private cinemaService: CinemaService,
                 private contactSservice: ContactService,
                 private authService: AuthService) {
        super();
    }

    ngOnInit(): void {

        this.subs.push( this.userService.User.subscribe( user => this.user = user ) );
        this.subs.push( this.userService.isLoggedIn.subscribe( value => this.isLoggedIn = value ) );

        const token = this.route.snapshot.queryParamMap.get( 'token' );
        const email = this.route.snapshot.queryParamMap.get( 'email' );

        if ( token && email ) {
            this.authModalsService.showRestorePasswordModal( token, email );
        }

        this.$showNotification = this.contactSservice.getNotification();
    }

    ngOnDestroy() {
        this.subs.forEach( u => u.unsubscribe() );
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

    showProfile(): void {
        const floating = document.getElementById( 'floating-profile' );
        if ( floating ) {
            this.userService.getProfile().finally();
            floating.style.right = '0';
        }
    }

    showShopping(): void {
        this.userService.fetchMyPurchases();
        const floating = document.getElementById( 'floating-shopping' );
        if ( floating ) {
            floating.style.right = '0';
        }
    }

    onClickLogout() {
        if ( this.buyTicket.purchase ) {
            this.buyTicket.cancelPurchase( this.buyTicket.purchase.id )
            .then( () => {
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

    payDeniedModal( code: string ): void {
        this.modalService.show( ModalPaymentDeniedComponent, {
            initialState: { code },
            class: 'modal-pay-denied'
        } );

        if ( this.getSessionStorage( 'purchaseData' ) ) {
            const purchaseData = JSON.parse( this.getSessionStorage( 'purchaseData' ) );
            const { purchase } = purchaseData;
            let url = '/chocolateria/pagar';
            if ( purchase.movie_id ) {
                url = `/peliculas/${purchase.movie_id}/${purchase.headquarter_id}/comprar/4`;
            }
            this.router.navigate( [url], { queryParams: { ref: 'home' } } ).finally();
        }
    }
}
