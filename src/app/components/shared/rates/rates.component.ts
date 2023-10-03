import { Component, OnInit } from '@angular/core';
import { BuyTicketService } from '@services/buy-ticket.service';
import { Tariff } from '@models/tariff.model';
import { GeneralService } from '@services/general.service';
import { MAX_TICKETS } from '@utils/constants';
import { CodeAwardInterface } from '@interfaces/awards';
import {TariffType} from "@utils/enums";

@Component( {
    selector: 'app-rates',
    templateUrl: './rates.component.html',
    styleUrls: ['./rates.component.scss']
} )
export class RatesComponent implements OnInit {

    MAX_TICKETS = MAX_TICKETS;
    tariffs: Tariff[] = [];
    // format?: FormatInterface;
    value!: number;
    typeTariff= TariffType;

    constructor( public buyTicketService: BuyTicketService,
                 private generalService: GeneralService ) { }

    ngOnInit(): void {
        if ( this.buyTicketService.selectedOption ) {
            const { movie_time } = this.buyTicketService.selectedOption;

            // this.format = this.generalService.getFormatById( format );
            this.getTariffs( movie_time );
        }
    }

    getTariffs( movie_time: number ) {
        this.buyTicketService.getTariffs( movie_time )
        .then( tariffs => {
            this.tariffs = tariffs;


            this.buyTicketService.tariffs.forEach( x => {
                const tariff = this.tariffs.find( t => t.id === x.id );
                if ( tariff ) {
                    tariff.quantity = x.quantity;
                }
            } );

            console.log( tariffs );
        } )
        .catch( console.log );
    }


    totalPayment() {
        this.buyTicketService.tariffs = this.tariffs.filter( x => x.quantity > 0 );

        this.buyTicketService.countTotals();
        /*let total = 0;
         this.buyTicketService.tickets_number = 0;

         this.tariffs.forEach( x => {
         total += x.quantity * x.online_price;
         this.buyTicketService.tickets_number += x.quantity * x.tickets_number;
         } );

         this.buyTicketService.setPayment( total );*/
    }

    removeAward( award: any ) {
        award.quantity = 0;
        this.buyTicketService.countTotals();
    }

    showPromotions() {
        return this.buyTicketService.ticketAwards.filter( x => x.quantity ).length > 0 || this.buyTicketService.codes.length;
    }

    removeCode( code: CodeAwardInterface ) {
        this.buyTicketService.codes = this.buyTicketService.codes.filter( x => x.code_promotion !== code.code_promotion );

        this.buyTicketService.countTotals();
    }
}
