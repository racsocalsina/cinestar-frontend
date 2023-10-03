import { Component, OnInit } from '@angular/core';
import { ScreenService } from '@services/screen.service';

@Component( {
    selector: 'app-buy-ticket-step2',
    templateUrl: './buy-ticket-step2.component.html',
    styleUrls: ['./buy-ticket-step2.component.scss']
} )
export class BuyTicketStep2Component implements OnInit {

    constructor( public screenService: ScreenService ) { }

    ngOnInit(): void {
    }

}
