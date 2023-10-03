import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalCancelBuyComponent } from '@components/modals/modal-cancel-buy/modal-cancel-buy.component';

@Component( {
    selector: 'app-header-buy-ticket',
    templateUrl: './header-buy-ticket.component.html',
    styleUrls: ['../header-home/header-home.component.scss', './header-buy-ticket.component.scss']
} )
export class HeaderBuyTicketComponent implements OnInit {

    @Input() step = 1;

    constructor( private router: Router,
                 private modalService: BsModalService ) { }

    ngOnInit(): void {
    }

    back(): void {
        const arrRoute = this.router.url.split( '/' );

        if ( this.step > 1 ) {
            arrRoute[ 5 ] = ( this.step - 1 ).toString();
            this.router.navigateByUrl( arrRoute.join( '/' ) ).finally();
        } else {
            const back = [arrRoute[ 0 ], arrRoute[ 1 ], arrRoute[ 2 ], arrRoute[ 3 ]].join( '/' );
            this.router.navigateByUrl( back ).finally();
        }
    }

    cancel(): void {
        this.modalService.show( ModalCancelBuyComponent, {
            class: 'modal-cancel-buy'
        } ).content?.onCancel.subscribe( () => {
            const arrRoute = this.router.url.split( '/' );
            const back = [arrRoute[ 0 ], arrRoute[ 1 ], arrRoute[ 2 ], arrRoute[ 3 ]].join( '/' );
            this.router.navigateByUrl( back ).finally();
        } );
    }
}
