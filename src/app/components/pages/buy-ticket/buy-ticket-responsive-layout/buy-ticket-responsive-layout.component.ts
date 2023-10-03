import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ModalResponsivePurchaseConfirmationComponent } from '@modals/modal-responsive-purchase-confirmation/modal-responsive-purchase-confirmation.component';
import { Movie } from '@models/movie.model';
import { BuyTicketService } from '@services/buy-ticket.service';
import { MovieTime, ShowTime } from '@models/show-time.model';
import { Subscription } from 'rxjs';
import { Utils } from '@utils/utils';
import { Seat } from '@interfaces/seat.interface';
import { CandyService } from '@services/candy.service';
import { TariffType } from '@utils/enums';

@Component( {
    selector: 'app-buy-ticket-responsive-layout',
    templateUrl: './buy-ticket-responsive-layout.component.html',
    styleUrls: [
        '../buy-ticket.component.scss',
        './buy-ticket-responsive-layout.component.scss'
    ]
} )
export class BuyTicketResponsiveLayoutComponent implements OnInit, OnDestroy {

    @Input() step = 1;
    @Input() movie!: Movie;
    @Input() showTime?: ShowTime;
    @Input() movieTime?: MovieTime;
    @Input() totalPayment = 0;
    @Input() seats: Seat[] = [];
    Utils = Utils;
    name?:string;
    address?:string;


    isLoading = false;
    subs: Subscription[] = [];

    constructor( private modalService: BsModalService,
                 private router: Router,
                 public candyService: CandyService,
                 public buyTicketService: BuyTicketService ) { }

    ngOnInit(): void {
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
        this.modalService.show( ModalResponsivePurchaseConfirmationComponent, {
            initialState: {
                movie: this.movie,
                showTime: this.showTime,
                movieTime: this.movieTime,
                // format: this.format,
                totalPayment: this.totalPayment,
                seats: this.seats
            },
            class: 'modal-responsive-purchase-confirmation'
        } );
    }

    discardCandy() {
        this.candyService.paymentAmount = 0;
        this.candyService.selectedProducts = [];
        this.candyService.fetchProducts( { headquarter_id: this.buyTicketService.selectedOption?.cinema } );
        this.candyService.fetchCombos( { headquarter_id: this.buyTicketService.selectedOption?.cinema } );
        this.candyService.fetchFavorites( { headquarter_id: this.buyTicketService.selectedOption?.cinema } );
        this.showModalConfirmation();
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
}
