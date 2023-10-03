import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component( {
    selector: 'app-modal-cancel-buy',
    templateUrl: './modal-cancel-buy.component.html',
    styleUrls: ['./modal-cancel-buy.component.scss']
} )
export class ModalCancelBuyComponent implements OnInit {

    onCancel = new EventEmitter();

    constructor( public bsModalRef: BsModalRef ) { }

    ngOnInit(): void {
    }

    cancel(): void {
        this.onCancel.emit();
        this.bsModalRef.hide();
    }
}
