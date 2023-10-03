import { Component, OnInit } from '@angular/core';
import { ScreenService } from '@services/screen.service';
import { ModalPointsExpireComponent } from '@modals/modal-points-expire/modal-points-expire.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BuyTicketService } from '@services/buy-ticket.service';

@Component( {
    selector: 'app-buy-ticket-step3',
    templateUrl: './buy-ticket-step3.component.html',
    styleUrls: ['./buy-ticket-step3.component.scss']
} )
export class BuyTicketStep3Component implements OnInit {

    constructor( public screenService: ScreenService,
                 private modalService: BsModalService,
                 private buyTicketService: BuyTicketService ) { }

    ngOnInit(): void {
        this.showModalTicketsExpire();
    }

    showModalTicketsExpire() {
        const { points_to_expire } = this.buyTicketService.pointsChecked.choco;
        if ( points_to_expire > 0 ) {
            this.modalService.show( ModalPointsExpireComponent, {
                class: 'modal-points-expire',
                initialState: {
                    points: points_to_expire
                }
            } );
        }
    }


}
