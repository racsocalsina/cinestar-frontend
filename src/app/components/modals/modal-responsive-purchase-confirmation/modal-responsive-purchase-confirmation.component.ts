import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { Movie } from '@models/movie.model';
import { MovieTime, ShowTime } from '@models/show-time.model';
import { FormatInterface } from '@interfaces/format.interface';
import { BuyTicketService } from '@services/buy-ticket.service';
import { Seat } from '@interfaces/seat.interface';
import { Utils } from '@utils/utils';
import { CandyService } from '@services/candy.service';

@Component( {
    selector: 'app-modal-responsive-purchase-confirmation',
    templateUrl: './modal-responsive-purchase-confirmation.component.html',
    styleUrls: ['./modal-responsive-purchase-confirmation.component.scss']
} )
export class ModalResponsivePurchaseConfirmationComponent implements OnInit {

    movie!: Movie;
    showTime?: ShowTime;
    movieTime?: MovieTime;
    // format?: FormatInterface;
    totalPayment = 0;
    seats: Seat[] = [];
    Utils = Utils;
    isLoading = false;
    error!: string | null;

    constructor( public bsModalRef: BsModalRef,
                 private router: Router,
                 public candyService: CandyService,
                 public buyTicketService: BuyTicketService ) { }

    ngOnInit(): void {
    }

    continue(): void {
        this.error = null;
        this.isLoading = true;

        if ( this.candyService.selectedProducts.length || this.candyService.purchase ) {
            this.createOrEditCandyPurchase();
        } else {
            this.redirect();
        }

    }

    redirect() {
        const arrRoute = this.router.url.split( '/' );
        arrRoute[ 5 ] = '4';
        this.router.navigateByUrl( arrRoute.join( '/' ) ).finally();
        this.bsModalRef.hide();
    }

    createOrEditCandyPurchase() {
        this.candyService.createOrEditPurchase( this.buyTicketService.selectedOption?.cinema, this.buyTicketService.purchase?.id )
        .then( ( res: any ) => {
            console.log( res );
            this.buyTicketService.purchase = res.data.purchase;
            this.candyService.purchase = res.data.purchase;
            this.redirect();
        } ).catch( error => this.error = error )
        .finally( () => this.isLoading = false );
    }

    showChocolateria() {
        return this.candyService.selectedProducts.length || this.candyService.chocoAwards.filter( x => ( x.quantity || 0 ) > 0 ).length;
    }
}
