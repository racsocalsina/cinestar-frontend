import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MyPurchaseInterface } from '@interfaces/my-purchase.interface';

@Component( {
    selector: 'app-ticket-detail',
    templateUrl: './ticket-detail.component.html',
    styleUrls: ['./ticket-detail.component.scss']
} )
export class TicketDetailComponent implements OnInit {

    purchase!: MyPurchaseInterface;

    constructor( public bsModalRef: BsModalRef ) { }

    ngOnInit(): void {
        console.log( this.purchase );
    }

    downloadTicket( ticket_url: any ) {
        window.open( ticket_url, '_blank' );
    }

}
