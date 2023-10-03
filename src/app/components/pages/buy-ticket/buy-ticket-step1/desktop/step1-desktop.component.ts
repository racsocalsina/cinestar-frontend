import { Component, OnInit } from '@angular/core';
import { BuyTicketService } from '@services/buy-ticket.service';

@Component( {
    selector: 'app-step1-desktop',
    templateUrl: './step1-desktop.component.html',
    styleUrls: ['./step1-desktop.component.scss']
} )
export class Step1DesktopComponent implements OnInit {

    allowed_for_promotions!: boolean;

    constructor( private buyTicketService: BuyTicketService ) { }

    ngOnInit(): void {
        this.allowed_for_promotions = this.buyTicketService.pointsChecked.ticket.allowed_for_promotions;
    }

}
