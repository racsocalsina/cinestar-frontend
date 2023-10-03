import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalCancelBuyComponent } from '@modals/modal-cancel-buy/modal-cancel-buy.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component( {
    selector: 'app-header-chocolateria',
    templateUrl: './header-chocolateria.component.html',
    styleUrls: [
        '../header-home/header-home.component.scss',
        './header-chocolateria.component.scss'
    ]
} )
export class HeaderChocolateriaComponent implements OnInit {

    @Input() showBack = false;
    @Input() title = 'Chocolatería';
    @Output() onCancel = new EventEmitter();

    constructor( private modalService: BsModalService ) { }

    ngOnInit(): void {
    }

    cancel() {
        this.modalService.show( ModalCancelBuyComponent, {
            class: 'modal-cancel-buy'
        } ).content?.onCancel.subscribe( () => {
            this.onCancel.emit();
        } );
    }
}
