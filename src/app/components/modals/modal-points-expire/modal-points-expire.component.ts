import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component( {
    selector: 'app-modal-points-expire',
    templateUrl: './modal-points-expire.component.html',
    styleUrls: ['./modal-points-expire.component.scss']
} )
export class ModalPointsExpireComponent implements OnInit {

    points!: number;

    constructor( public bsModalRef: BsModalRef ) { }

    ngOnInit(): void {
    }

}
