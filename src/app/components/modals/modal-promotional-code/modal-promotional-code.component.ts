import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BuyTicketService } from '@services/buy-ticket.service';
import { Utils } from '@utils/utils';
import { MAX_TICKETS } from '@utils/constants';
import { CodeAwardInterface } from '@interfaces/awards';
import { CandyService } from '@services/candy.service';

@Component( {
    selector: 'app-modal-promotional-code',
    templateUrl: './modal-promotional-code.component.html',
    styleUrls: ['./modal-promotional-code.component.scss']
} )
export class ModalPromotionalCodeComponent implements OnInit {

    type!: string;
    accumulatedPoints!: number;
    showCustomCode = false;
    customCode: string | undefined;
    Utils = Utils;
    MAX_TICKETS = MAX_TICKETS;
    codes: CodeAwardInterface[] = [];

    constructor( public bsModalRef: BsModalRef,
                 public buyTicketService: BuyTicketService,
                 public candyService: CandyService ) { }

    ngOnInit(): void {
        console.log( this.type );
        console.log( this.accumulatedPoints );
    }

    onChange() {
        this.buyTicketService.countTotals();
    }

    validateCode(): void {
        if ( this.customCode?.trim() ) {
            const codePromotion = this.customCode?.trim().toUpperCase();
            const movie_time_id = this.buyTicketService?.selectedOption?.movie_time;
            this.buyTicketService.validateCode( movie_time_id, this.customCode?.trim().toUpperCase() )
            .then( code => {
                this.customCode = '';
                if ( !this.codes.find( x => x.code_promotion === codePromotion ) ) {
                    this.codes.push( code );
                }
            } ).catch( error => Utils.showToast( error ) );
        }
    }

    useCode( evt: any, code: CodeAwardInterface ) {
        if ( evt.target.checked && this.buyTicketService.tickets_number + code.tickets_number <= MAX_TICKETS ) {
            if ( !this.buyTicketService.codes.find( x => x.code_promotion === code.code_promotion ) ) {
                this.buyTicketService.codes.push( { ...code, quantity: 1 } );
            }
        } else {
            this.buyTicketService.codes = this.buyTicketService.codes.filter( x => x.code_promotion !== code.code_promotion );
        }

        this.buyTicketService.countTotals();
    }
}
