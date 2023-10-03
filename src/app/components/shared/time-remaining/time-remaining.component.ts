import { Component, OnInit } from '@angular/core';
import { BuyTicketService } from '@services/buy-ticket.service';

@Component( {
    selector: 'app-time-remaining',
    templateUrl: './time-remaining.component.html',
    styleUrls: ['../message-notification/message-notification.component.scss', './time-remaining.component.scss']
} )
export class TimeRemainingComponent implements OnInit {

    constructor( public buyService: BuyTicketService ) { }

    ngOnInit(): void {
    }

}
