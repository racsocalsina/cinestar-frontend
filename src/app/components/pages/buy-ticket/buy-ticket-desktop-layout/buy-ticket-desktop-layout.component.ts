import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalCancelBuyComponent } from '@modals/modal-cancel-buy/modal-cancel-buy.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ModalDesktopPurchaseConfirmationComponent } from '@modals/modal-desktop-purchase-confirmation/modal-desktop-purchase-confirmation.component';
import { BuyTicketService } from '@services/buy-ticket.service';
import { Movie } from '@models/movie.model';
import { MovieTime, ShowTime } from '@models/show-time.model';
import { Utils } from '@utils/utils';
import { Subscription } from 'rxjs';
import { Seat } from '@interfaces/seat.interface';
import { CandyService } from '@services/candy.service';
import { TariffType } from '@utils/enums';
import {UserService} from "@services/user.service";

@Component( {
    selector: 'app-buy-ticket-desktop-layout',
    templateUrl: './buy-ticket-desktop-layout.component.html',
    styleUrls: [
        '../buy-ticket.component.scss',
        './buy-ticket-desktop-layout.component.scss'
    ]
} )
export class BuyTicketDesktopLayoutComponent implements OnInit, OnDestroy {

    @Input() step = 1;
    @Input() movie!: Movie;
    @Input() showTime?: ShowTime;
    @Input() movieTime?: MovieTime;
    @Input() totalPayment = 0;
    @Input() seats: Seat[] = [];
    name?:string;
    address?:string;

    Utils = Utils;
    isLoggedIn: boolean = false;
    isLoading = false;
    subs: Subscription[] = [];

    constructor( private modalService: BsModalService,
                 public buyTicketService: BuyTicketService,
                 public candyService: CandyService,
                 private router: Router,
                 private userService: UserService) {
    }

    ngOnInit(): void {
        this.subs.push( this.userService.isLoggedIn.subscribe( res => this.isLoggedIn = res ) );
        this.subs.push( this.buyTicketService.$loading
        .asObservable().subscribe( value => this.isLoading = value ) );
        this.movie =  this.buyTicketService.selectedOption?.movie!;
        if (this.movie.movie_times && this.movie.movie_times.length > 0) {
            this.movieTime = this.movie.movie_times.find(time => time.id === this.buyTicketService.selectedOption?.movie_time);
        }
        this.name = this.buyTicketService._name;
        this.address = this.buyTicketService._address;
    }

    ngOnDestroy() {
        this.subs.forEach( s => s.unsubscribe() );
    }

    cancel(): void {
        this.modalService.show( ModalCancelBuyComponent, {
            class: 'modal-cancel-buy'
        } ).content?.onCancel.subscribe( () => {
            const arrRoute = this.router.url.split( '/' );
            const back = [arrRoute[ 0 ], arrRoute[ 1 ], arrRoute[ 2 ], arrRoute[ 3 ]].join( '/' );
            this.router.navigateByUrl( back ).finally();
        } );
    }

    back(): void {
        const arrRoute = this.router.url.split( '/' );

        if ( this.step > 1 ) {
            arrRoute[ 5 ] = ( this.step - 1 ).toString();
            this.router.navigateByUrl( arrRoute.join( '/' ) ).finally();
        } else {
            const back = [arrRoute[ 0 ], arrRoute[ 1 ], arrRoute[ 2 ], arrRoute[ 3 ]].join( '/' );
            this.router.navigateByUrl( back ).finally();
        }
    }

    nextStep(): void {
        if ( this.step === 1 ) {
            this.initPurchase();
        } else if ( this.step === 2 ) {
            this.confirm();
        } else if ( this.step === 3 ) {
            this.showModalConfirmation();
        } else if ( this.step === 4 && !this.isLoading) {
            this.buyTicketService.initNiubiz.next();
        } else {
            this.redirect();
        }
    }

    showModalConfirmation() {
        this.modalService.show( ModalDesktopPurchaseConfirmationComponent, {
            initialState: {
                movie: this.movie,
                showTime: this.showTime,
                movieTime: this.movieTime,
                totalPayment: this.totalPayment,
                seats: this.seats
            },
            class: 'modal-desktop-purchase-confirmation'
        } );
    }

    redirect() {
        const arrRoute = this.router.url.split( '/' );
        arrRoute[ 5 ] = ( this.step + 1 ).toString();
        this.router.navigateByUrl( arrRoute.join( '/' ) ).finally();
    }

    confirm() {
        this.redirect();
        // this.isLoading = true;
        // this.buyTicketService.confirm()
        // .then( async res => {
        //     console.log( res );
        //     const data = await this.buyTicketService.getGraph();
        //     this.buyTicketService.graph = data.graph;
        //     this.isLoading = false;
        //     this.redirect();
        // } ).catch( error => {
        //     Utils.showToast( error );
        //     this.buyTicketService.onError.next( true );
        //     this.isLoading = false;
        // } );
    }

    initPurchase() {
        const params: any = {
            origin: 'web',
            movie_time_id: this.buyTicketService.selectedOption?.movie_time,
            tickets: []
        };

        this.buyTicketService.tariffs.forEach( x => {
            let ticket: any = {
                movie_time_tariff_id: x.id,
                quantity: x.quantity,
                type: x.type,
                codes: []
            };

            let promotion_id = 0;

            if ( x.type === TariffType.Premio ) {
                promotion_id = x.id;
            } else if ( x.type === TariffType.Promocion ) {
                promotion_id = x.ticket_promotion_id;
            }

            ticket = {
                ...ticket,
                promotion_id
            };

            params.tickets.push( ticket );
        } );

        this.buyTicketService.ticketAwards.forEach( x => {
            if ( x.quantity > 0 ) {
                params.tickets.push( {
                    promotion_id: x.id,
                    movie_time_tariff_id: x.movie_time_tariff_id,
                    quantity: x.quantity,
                    type: x.type,
                    codes: []
                } );
            }
        } );

        const codeParams: any[] = [];

        this.buyTicketService.codes.forEach( x => {
            const code = codeParams.find( c => c.promotion_id === x.id );
            if ( code ) {
                code.quantity += x.quantity;
                code.codes.push( x.code_promotion );
            } else {
                codeParams.push( {
                    promotion_id: x.id,
                    movie_time_tariff_id: x.movie_time_tariff_id,
                    quantity: x.quantity,
                    type: x.type,
                    codes: [x.code_promotion]
                } );
            }

        } );

        params.tickets.push( ...codeParams );

        console.log( params );

        this.isLoading = true;
        const promise = this.buyTicketService.purchase
            ? this.buyTicketService.updatePurchase( params, this.buyTicketService.purchase.id )
            : this.buyTicketService.initPurchase( params );

        promise.then( ( res: any ) => {
            console.log( res );
            this.buyTicketService.purchase = res.data.purchase;
            this.buyTicketService.graph = res.data.graph;
            this.buyTicketService.original_graph = res.data.original_graph;
            this.redirect();
        } ).catch( error => {
            console.log( error );
            Utils.showToast( error );
        } ).finally( () => this.isLoading = false );
    }

    showChocolateria() {
        return this.candyService.selectedProducts.length || this.candyService.chocoAwards.filter( x => ( x.quantity || 0 ) > 0 ).length;
    }
}
