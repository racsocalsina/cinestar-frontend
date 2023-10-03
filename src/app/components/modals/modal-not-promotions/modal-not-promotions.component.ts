import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component( {
    selector: 'app-modal-not-promotions',
    templateUrl: './modal-not-promotions.component.html',
    styleUrls: ['./modal-not-promotions.component.scss']
} )
export class ModalNotPromotionsComponent implements OnInit {

    constructor( public modalRef: BsModalRef ) { }

    ngOnInit(): void {
    }

}
