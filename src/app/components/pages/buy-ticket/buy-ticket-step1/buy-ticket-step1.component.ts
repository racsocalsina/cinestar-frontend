import { Component, OnInit } from '@angular/core';
import { ScreenService } from '@services/screen.service';
import { BuyTicketService } from '@services/buy-ticket.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalPointsExpireComponent } from '@modals/modal-points-expire/modal-points-expire.component';

@Component( {
    selector: 'app-buy-ticket-step1',
    templateUrl: './buy-ticket-step1.component.html',
    styleUrls: ['./buy-ticket-step1.component.scss']
} )
export class BuyTicketStep1Component implements OnInit {

    constructor( private modalService: BsModalService,
                 public screenService: ScreenService,
                 private buyTicketService: BuyTicketService ) { }

    ngOnInit(): void {
        this.buyTicketService.setSeats( [] );
        this.showModalTicketsExpire();
    }

    showModalTicketsExpire() {
        const { points_to_expire, allowed_for_promotions } = this.buyTicketService.pointsChecked.ticket;
        if ( allowed_for_promotions && points_to_expire > 0 ) {
            this.modalService.show( ModalPointsExpireComponent, {
                class: 'modal-points-expire',
                initialState: {
                    points: points_to_expire
                }
            } );
        }
    }

}
