import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PromotionInterface } from '@interfaces/promotion.interface';
import { Utils } from '@utils/utils';

@Component( {
    selector: 'app-modal-rewards',
    templateUrl: './modal-rewards.component.html',
    styleUrls: ['./modal-rewards.component.scss']
} )
export class ModalRewardsComponent implements OnInit {

    rewardType!: string;
    data: PromotionInterface[] = [];
    Utils = Utils;

    constructor( public bsModalRef: BsModalRef ) { }

    ngOnInit(): void {

    }

}
