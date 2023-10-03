import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Utils } from '@utils/utils';

@Component( {
    selector: 'app-modal-pay-confirmation',
    templateUrl: './modal-pay-confirmation.component.html',
    styleUrls: ['./modal-pay-confirmation.component.scss']
} )
export class ModalPayConfirmationComponent implements OnInit {

    error!: string;
    data: any;
    isSafari = Utils.isSafari();
    Utils = Utils;

    constructor( public bsModalRef: BsModalRef ) { }

    ngOnInit(): void {
    }

    downloadTicket( ticket_url: any ) {
        window.open( ticket_url, '_blank' );
    }
}
