import { Component, OnInit } from '@angular/core';
import { BuyTicketService } from '@services/buy-ticket.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalNotPromotionsComponent } from '@modals/modal-not-promotions/modal-not-promotions.component';

@Component( {
    selector: 'app-step1-responsive',
    templateUrl: './step1-responsive.component.html',
    styleUrls: ['./step1-responsive.component.scss']
} )
export class Step1ResponsiveComponent implements OnInit {

    allowed_for_promotions!: boolean;

    constructor( private modalService: BsModalService,
                 private buyTicketService: BuyTicketService ) { }

    ngOnInit(): void {
        this.allowed_for_promotions = this.buyTicketService.pointsChecked.ticket.allowed_for_promotions;

        if ( !this.allowed_for_promotions ) {
            this.showModalNotAllowed();
        }
    }

    showModalNotAllowed() {
        this.modalService.show( ModalNotPromotionsComponent, {
            class: 'modal-points-expire'
        } );
    }

}
