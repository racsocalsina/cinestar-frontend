import { Component, OnInit } from '@angular/core';
import { ScreenService } from '@services/screen.service';

@Component( {
    selector: 'app-buy-ticket-step4',
    templateUrl: './buy-ticket-step4.component.html',
    styleUrls: ['./buy-ticket-step4.component.scss']
} )
export class BuyTicketStep4Component implements OnInit {

    constructor( public screenService: ScreenService ) { }

    ngOnInit(): void {
    }

}
