import { Component, OnDestroy, OnInit } from '@angular/core';
import { Utils } from '@utils/utils';
import { Observable, Subscription } from 'rxjs';
import { User } from '@models/user.model';
import { UserService } from '@services/user.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalRewardsComponent } from '@modals/modal-rewards/modal-rewards.component';
import { PromotionInterface } from '@interfaces/promotion.interface';
import { MovementInterface } from '@interfaces/movement.interface';

@Component( {
    selector: 'app-promotions-profile',
    templateUrl: './promotions-profile.component.html',
    styleUrls: ['./promotions-profile.component.scss']
} )
export class PromotionsProfileComponent implements OnInit, OnDestroy {

    Utils = Utils;
    subs: Subscription[] = [];
    user!: User;
    rewardType = 'boleteria';
    showRewards = false;
    movements: MovementInterface[] | undefined = [];
    promotions: PromotionInterface[] | undefined = [];

    constructor( private modalService: BsModalService,
                 private userService: UserService ) {}

    ngOnInit(): void {
        this.subs.push( this.userService.User.subscribe( user => {
            this.user = user;
            if ( this.rewardType === 'boleteria' ) {
                this.movements = this.user.ticket_promotional_data?.movements;
                this.promotions = this.user.ticket_promotional_data?.promotions;
            } else {
                this.movements = this.user.choco_promotional_data?.movements;
                this.promotions = this.user.choco_promotional_data?.promotions;
            }

        } ) );

    }

    ngOnDestroy() {
        this.subs.forEach( s => s.unsubscribe() );
    }

    openModal() {
        this.modalService.show( ModalRewardsComponent, {
            initialState: {
                data: this.promotions,
                rewardType: this.rewardType
            }
        } );
    }

    selectType( type: string, movements?: MovementInterface[], promotions?: PromotionInterface[] ) {
        this.promotions = promotions;
        this.movements = movements;
        this.rewardType = type;
    }
}
