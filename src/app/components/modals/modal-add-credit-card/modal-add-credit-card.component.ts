import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component( {
    selector: 'app-modal-add-credit-card',
    templateUrl: './modal-add-credit-card.component.html',
    styleUrls: ['./modal-add-credit-card.component.scss']
} )
export class ModalAddCreditCardComponent implements OnInit {

    onAdded = new EventEmitter();

    constructor( public bsModalRef: BsModalRef ) { }

    ngOnInit(): void {
    }

    creditCardAdded() {
        this.onAdded.emit();
        this.bsModalRef.hide();
    }
}
