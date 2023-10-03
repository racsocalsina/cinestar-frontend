import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BuyTicketService } from '@services/buy-ticket.service';
import { Utils } from '@utils/utils';

@Component( {
    selector: 'app-modal-payment-denied',
    templateUrl: './modal-payment-denied.component.html',
    styleUrls: [
        '../modal-pay-confirmation/modal-pay-confirmation.component.scss',
        './modal-payment-denied.component.scss'
    ]
} )
export class ModalPaymentDeniedComponent implements OnInit {

    code!: string;
    isLoading = true;
    error!: string;
    data: any;
    isSafari = Utils.isSafari();

    constructor( public bsModalRef: BsModalRef,
                 private buyTicketService: BuyTicketService ) { }

    ngOnInit(): void {
        this.getPurchase();
    }

    getPurchase() {
        this.buyTicketService.getPurchase( { code: this.code } )
        .then( res => {
            console.log( res );
            this.data = res;
        } )
        .catch( error => this.error = error )
        .finally( () => {
            this.isLoading = false;
        } );
    }

    close() {
        if ( !this.isLoading ) {
            this.bsModalRef.hide();
        }
    }
}
